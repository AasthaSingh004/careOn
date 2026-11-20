import os
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app import __version__
from app.database import engine, Base, get_db, run_db_migrations
from app.models import User, Incident, Resource, Assignment, ExternalProvider, ProviderEnquiry, Notification, Feedback
from app.auth import (
    get_current_user,
    get_current_admin,
    get_optional_user,
    create_access_token,
)
from app.schemas import (
    # Auth
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    # Incidents
    IncidentCreate,
    IncidentVerify,
    IncidentStatusUpdate,
    IncidentPriorityUpdate,
    IncidentCancel,
    IncidentResponse,
    IncidentCreateResponse,
    RequestOTPResponse,
    DoctorCallbackCreate,
    DoctorCallbackUpdateStatus,
    DoctorCallbackResponse,
    IncidentDetailResponse,
    SystemConfigResponse,
    # Resources
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
    # Allocation
    AllocationRecommendRequest,
    AllocationConfirmRequest,
    # Providers
    ProviderCreate,
    ProviderResponse,
    ProviderEnquiryCreate,
    ProviderEnquiryUpdate,
    ProviderEnquiryResponse,
    # Notifications & Feedback
    NotificationResponse,
    FeedbackCreate,
    FeedbackResponse,
    # Chatbot & Simulation
    ChatbotMessageRequest,
    ChatbotMessageResponse,
    SimulationRunRequest,
    # Legacy Schemas
    EmergencyCreate,
    EmergencyUpdateStatus,
    EmergencyResponse,
    StatsResponse,
    HealthResponse,
)
from app import crud
from app.algorithms.allocation import evaluate_allocation_for_incident, compute_multi_incident_allocations
from app.algorithms.shortage import get_current_shortages
from app.algorithms.prediction import predict_resource_shortage_risk
from app.chatbot.sahara import process_sahara_message


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist, execute non-destructive column migrations, and seed demo data on startup
    Base.metadata.create_all(bind=engine)
    run_db_migrations(engine)
    db = next(get_db())
    try:
        crud.seed_demo_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="CareOn - Intelligent Emergency Resource Coordination Platform",
    description="Backend decision-support API for emergency coordination, resource allocation, and multi-device access.",
    version=__version__,
    lifespan=lifespan,
)

# CORS configuration:
# Configurable via CORS_ORIGINS environment variable (comma-separated list).
# Supports localhost during development and explicit frontend domains in production.
# Never combines wildcard '*' with allow_credentials=True.
cors_origins_env = os.getenv("CORS_ORIGINS", "").strip()
if cors_origins_env:
    allowed_origins = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

if allowed_origins == ["*"] or "*" in allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# ==============================================================================
# System & Health
# ==============================================================================
@app.get("/", tags=["System"])
def root():
    return {
        "service": "CareOn Emergency Dispatch API",
        "product": "CareOn - Intelligent Emergency Resource Coordination Platform",
        "tagline": "Help is closer than you think.",
        "status": "online",
        "version": __version__,
        "docs": "/docs",
    }


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check(db: Session = Depends(get_db)):
    """Healthcheck endpoint for Docker Compose, CI, and orchestrators."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "degraded", "database": db_status},
        )

    return HealthResponse(
        status="healthy",
        database=db_status,
        timestamp=datetime.now(timezone.utc).isoformat(),
        version=__version__,
    )


@app.get("/api/config", response_model=SystemConfigResponse, tags=["System"])
def get_system_config():
    """Retrieve public system configuration and emergency disclaimers."""
    return SystemConfigResponse(
        official_emergency_number="112",
        official_emergency_disclaimer=(
            "CareOn is an emergency coordination decision-support tool, not a replacement for government emergency services (112 / 108)."
        ),
    )


# ==============================================================================
# Auth Routes
# ==============================================================================
@app.post("/api/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, tags=["Auth"])
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if payload.confirm_password and payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )
    existing = crud.get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )
    # Security Rule: Public registration MUST NEVER create an admin account. Role is forced to 'user'.
    user = crud.create_user(
        db=db,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        password=payload.password,
        role="user",
    )
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="Bearer", user=UserResponse.model_validate(user))


@app.post("/api/auth/login", response_model=TokenResponse, tags=["Auth"])
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="Bearer", user=UserResponse.model_validate(user))


@app.get("/api/auth/me", response_model=UserResponse, tags=["Auth"])
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


# ==============================================================================
# Incident Routes
# ==============================================================================
@app.post("/api/incidents", response_model=IncidentCreateResponse, status_code=status.HTTP_201_CREATED, tags=["Incidents"])
def report_incident(
    payload: IncidentCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Public / user emergency reporting endpoint."""
    user_id = current_user.id if current_user else None
    incident, raw_otp = crud.create_incident(db, payload, user_id=user_id)
    # The simulated OTP is returned only to the authenticated reporter in the immediate creation flow
    simulated_otp = raw_otp if current_user else None
    resp = IncidentCreateResponse.model_validate(incident)
    resp.simulated_otp = simulated_otp
    return resp


@app.get("/api/incidents", response_model=List[IncidentResponse], tags=["Incidents"])
def list_incidents(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    category_filter: Optional[str] = Query(None, alias="category"),
    search: Optional[str] = Query(None),
    my_requests_only: bool = Query(False),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    List incidents with role-based privacy:
    - If user is logged in as a normal user, only their own incidents are returned.
    - Admins see all incidents across the platform.
    """
    user_id = None
    if current_user and current_user.role != "admin":
        user_id = current_user.id
    elif my_requests_only and current_user:
        user_id = current_user.id

    return crud.get_incidents(
        db,
        status_filter=status_filter,
        priority_filter=priority_filter,
        category_filter=category_filter,
        user_id=user_id,
        search=search,
    )


@app.get("/api/incidents/{identifier}", response_model=IncidentDetailResponse, tags=["Incidents"])
def get_incident_details(
    identifier: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Retrieve full incident details by numeric ID or incident code with privacy protection."""
    item = crud.get_incident_by_id_or_code(db, identifier)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident '{identifier}' not found.",
        )
    # Privacy check: Regular user cannot view another user's private emergency record
    if current_user and current_user.role != "admin" and item.user_id and item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You cannot view another user's private emergency incident.",
        )
    is_authorized = bool(
        current_user and (current_user.role == "admin" or (item.user_id and item.user_id == current_user.id))
    )
    resp = IncidentDetailResponse.model_validate(item)
    if not is_authorized:
        sanitized_cbs = []
        for cb in resp.doctor_callback_requests:
            cb_dict = cb.model_dump()
            cb_dict["contact_phone"] = None
            sanitized_cbs.append(DoctorCallbackResponse.model_validate(cb_dict))
        resp.doctor_callback_requests = sanitized_cbs
    return resp


@app.post("/api/incidents/{incident_id}/request-otp", response_model=RequestOTPResponse, tags=["Incidents"])
def request_new_otp(
    incident_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate or retrieve a fresh simulated OTP for the authenticated reporter.
    Restricted strictly to the authenticated reporter of the incident.
    """
    incident = crud.get_incident_by_id_or_code(db, str(incident_id))
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident #{incident_id} not found.")
    if incident.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only the incident reporter can request an emergency verification OTP.",
        )
    if incident.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incident is already verified.",
        )
    raw_otp, expires_at = crud.regenerate_incident_otp(db, incident)

    # In-App Emergency Verification OTP notification
    otp_notif = Notification(
        user_id=incident.user_id,
        incident_id=incident.id,
        title=f"Emergency Verification Code ({incident.incident_code})",
        message=f"Your CareOn verification code is: {raw_otp}. Enter this code in the verification box to continue. (In-App Demo OTP)",
        type="alert",
        target_role="user",
    )
    db.add(otp_notif)
    db.commit()

    return RequestOTPResponse(
        incident_id=incident.id,
        incident_code=incident.incident_code,
        simulated_otp=raw_otp,
        expires_at=expires_at,
    )


@app.post("/api/incidents/{incident_id}/verify", response_model=IncidentResponse, tags=["Incidents"])
def verify_incident_otp(
    incident_id: int,
    payload: IncidentVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify phone contact via emergency OTP. Restricted to the authenticated incident reporter."""
    updated, outcome = crud.verify_incident(db, incident_id, payload.otp, current_user=current_user)
    if outcome == "not_found":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident #{incident_id} not found.")
    if outcome == "unauthorized":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required to verify emergency incident.")
    if outcome == "forbidden":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Only the incident reporter can verify this emergency incident.")
    if outcome == "already_verified":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incident is already verified. Reusing verification code is not allowed.")
    if outcome == "attempts_exceeded":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum verification attempts exceeded (5/5). Please request a new emergency verification code.")
    if outcome == "expired":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Emergency verification code has expired. Please request a new code.")
    if outcome.startswith("invalid_otp"):
        remaining = outcome.split(":")[-1]
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid verification code. Attempts remaining: {remaining}.")
    return updated


# ==============================================================================
# Doctor Callback Routes
# ==============================================================================
@app.post("/api/incidents/{incident_id}/doctor-callback", response_model=DoctorCallbackResponse, status_code=status.HTTP_201_CREATED, tags=["Doctor Callback"])
def request_doctor_callback(
    incident_id: int,
    payload: DoctorCallbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Request an on-call medical tele-triage callback. Restricted to authenticated incident reporter."""
    incident = crud.get_incident_by_id_or_code(db, str(incident_id))
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident #{incident_id} not found.")
    if incident.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Only the incident reporter can request a doctor callback.")

    contact_name = payload.contact_name or current_user.name
    contact_phone = payload.contact_phone or current_user.phone
    cb_req = crud.create_doctor_callback_request(
        db=db,
        incident_id=incident.id,
        user_id=current_user.id,
        contact_name=contact_name,
        contact_phone=contact_phone,
        chief_complaint=payload.chief_complaint,
    )
    resp = DoctorCallbackResponse.model_validate(cb_req)
    resp.incident_code = incident.incident_code
    return resp


@app.get("/api/incidents/{incident_id}/doctor-callback", response_model=List[DoctorCallbackResponse], tags=["Doctor Callback"])
def get_incident_doctor_callbacks(
    incident_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """View doctor callback requests for a specific incident. Restricted to incident reporter or coordinator."""
    incident = crud.get_incident_by_id_or_code(db, str(incident_id))
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incident #{incident_id} not found.")
    if current_user.role != "admin" and incident.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: You cannot view callback requests for this incident.")
    items = crud.get_incident_doctor_callbacks(db, incident.id)
    results = []
    for item in items:
        r = DoctorCallbackResponse.model_validate(item)
        r.incident_code = incident.incident_code
        results.append(r)
    return results


@app.get("/api/admin/doctor-callbacks", response_model=List[DoctorCallbackResponse], tags=["Doctor Callback"])
def list_all_doctor_callbacks(
    status_filter: Optional[str] = Query(None, alias="status"),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin-only: list all doctor callback requests with pending triage visibility."""
    items = crud.get_doctor_callbacks(db, status_filter=status_filter)
    results = []
    for item in items:
        r = DoctorCallbackResponse.model_validate(item)
        if item.incident:
            r.incident_code = item.incident.incident_code
        results.append(r)
    return results


@app.patch("/api/admin/doctor-callbacks/{callback_id}", response_model=DoctorCallbackResponse, tags=["Doctor Callback"])
def update_doctor_callback(
    callback_id: int,
    payload: DoctorCallbackUpdateStatus,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin-only: update doctor callback triage status and clinical notes."""
    updated = crud.update_doctor_callback_status(
        db=db,
        callback_id=callback_id,
        status=payload.status,
        admin_notes=payload.admin_notes,
        assigned_to=payload.assigned_to,
        actor=admin.name,
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor callback request not found.")
    resp = DoctorCallbackResponse.model_validate(updated)
    if updated.incident:
        resp.incident_code = updated.incident.incident_code
    return resp


@app.patch("/api/incidents/{incident_id}/status", response_model=IncidentResponse, tags=["Incidents"])
def update_status(
    incident_id: int,
    payload: IncidentStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin-only: update incident lifecycle status."""
    updated = crud.update_incident_status(
        db,
        incident_id=incident_id,
        new_status=payload.status,
        actor=admin.name,
        message=payload.message,
        internal_notes=payload.internal_admin_notes,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident #{incident_id} not found.",
        )
    return updated


@app.patch("/api/incidents/{incident_id}/priority", response_model=IncidentResponse, tags=["Incidents"])
def update_priority(
    incident_id: int,
    payload: IncidentPriorityUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin-only: manually override incident priority with recorded reason."""
    updated = crud.update_incident_priority(
        db,
        incident_id=incident_id,
        new_priority=payload.priority,
        reason=payload.reason,
        actor=admin.name,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident #{incident_id} not found.",
        )
    return updated


@app.post("/api/incidents/{incident_id}/cancel", response_model=IncidentResponse, tags=["Incidents"])
def cancel_incident_endpoint(
    incident_id: int,
    payload: IncidentCancel,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """User-initiated or admin cancellation with reason."""
    actor = "admin" if (current_user and current_user.role == "admin") else "user"
    cancelled = crud.cancel_incident(
        db=db,
        incident_id=incident_id,
        reason=payload.reason,
        cancelled_by=actor,
        details=payload.details,
    )
    if not cancelled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident #{incident_id} not found.",
        )
    return cancelled


@app.post("/api/incidents/{incident_id}/acknowledge-cancellation", response_model=IncidentResponse, tags=["Incidents"])
def acknowledge_cancellation_endpoint(
    incident_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin acknowledges user cancellation and safely releases assigned resources."""
    updated = crud.acknowledge_cancellation_and_release(db, incident_id, actor=admin.name)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident #{incident_id} not found.",
        )
    return updated


@app.post("/api/incidents/{incident_id}/resolve", response_model=IncidentResponse, tags=["Incidents"])
def resolve_incident_endpoint(
    incident_id: int,
    notes: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin marks incident resolved and releases active resources."""
    updated = crud.resolve_incident(db, incident_id, actor=admin.name, notes=notes)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incident #{incident_id} not found.",
        )
    return updated


@app.post("/api/incidents/{incident_id}/confirm-arrival", response_model=IncidentResponse, tags=["Incidents"])
def confirm_arrival_endpoint(
    incident_id: int,
    notes: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Citizen explicitly confirms emergency assistance has arrived and incident is resolved."""
    incident = crud.get_incident_by_id_or_code(db, str(incident_id))
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found.")
    if incident.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the incident reporter can confirm arrival.")
    updated = crud.resolve_incident(
        db,
        incident.id,
        actor=current_user.name,
        notes=notes or "Citizen confirmed responder arrived on scene.",
    )
    return updated


# ==============================================================================
# Resource Routes
# ==============================================================================
@app.get("/api/resources", response_model=List[ResourceResponse], tags=["Resources"])
def list_resources(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_filter: Optional[str] = Query(None, alias="category"),
    db: Session = Depends(get_db),
):
    return crud.get_resources(db, status_filter=status_filter, category_filter=category_filter)


@app.post("/api/resources", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED, tags=["Resources"])
def create_resource(
    payload: ResourceCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    res = Resource(
        resource_code=payload.resource_code,
        name=payload.name,
        category=payload.category,
        capabilities=payload.capabilities,
        location_name=payload.location_name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        status=payload.status or "Available",
        capacity=payload.capacity or 1,
        contact_phone=payload.contact_phone,
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res


@app.get("/api/resources/{resource_id}", response_model=ResourceResponse, tags=["Resources"])
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    res = crud.get_resource_by_id(db, resource_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource #{resource_id} not found.",
        )
    return res


@app.patch("/api/resources/{resource_id}", response_model=ResourceResponse, tags=["Resources"])
def update_resource_endpoint(
    resource_id: int,
    payload: ResourceUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    res = crud.update_resource(db, resource_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource #{resource_id} not found.",
        )
    return res


# ==============================================================================
# Smart Allocation & Shortage Routes
# ==============================================================================
@app.post("/api/allocations/recommend", tags=["Allocation"])
def recommend_allocation(
    payload: AllocationRecommendRequest,
    db: Session = Depends(get_db),
):
    """Evaluate suitable resource for a specific incident."""
    incident = db.query(Incident).filter(Incident.id == payload.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    available = db.query(Resource).filter(Resource.status == "Available").all()
    recommendation = evaluate_allocation_for_incident(incident, available, db)
    return recommendation


@app.post("/api/allocations/multi-recommend", tags=["Allocation"])
def multi_recommend_allocation(
    db: Session = Depends(get_db),
):
    """Evaluate and recommend allocations across all active unassigned incidents."""
    assigned_inc_ids = {a.incident_id for a in db.query(Assignment).filter(Assignment.status == "Active").all()}
    active_incidents = (
        db.query(Incident)
        .filter(Incident.status.notin_(["Resolved", "Cancelled", "Rejected"]), ~Incident.id.in_(assigned_inc_ids))
        .all()
    )
    return compute_multi_incident_allocations(active_incidents, db)


@app.post("/api/allocations/confirm", tags=["Allocation"])
def confirm_allocation_endpoint(
    payload: AllocationConfirmRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Coordinator confirms assignment of a resource to an incident.
    Enforces strict conflict prevention.
    """
    try:
        assignment = crud.confirm_assignment(
            db=db,
            incident_id=payload.incident_id,
            resource_id=payload.resource_id,
            assigned_by=admin.name,
            notes=payload.notes,
        )
        return {
            "status": "success",
            "message": f"Resource assigned successfully to incident.",
            "assignment_id": assignment.id,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@app.post("/api/allocations/{assignment_id}/release", tags=["Allocation"])
def release_assignment_endpoint(
    assignment_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    released = crud.release_assignment(db, assignment_id, actor=admin.name)
    if not released:
        raise HTTPException(status_code=404, detail="Assignment not found.")
    return {"status": "success", "message": "Resource safely released back to fleet."}


@app.get("/api/allocations/shortages", tags=["Allocation"])
def list_current_shortages(db: Session = Depends(get_db)):
    """Retrieve all current resource shortages and suggested external alternatives."""
    return get_current_shortages(db)


# ==============================================================================
# External Providers Routes
# ==============================================================================
@app.get("/api/providers", response_model=List[ProviderResponse], tags=["Providers"])
def list_providers(db: Session = Depends(get_db)):
    return crud.get_providers(db)


@app.post("/api/providers", response_model=ProviderResponse, status_code=status.HTTP_201_CREATED, tags=["Providers"])
def create_provider(
    payload: ProviderCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    provider = ExternalProvider(
        name=payload.name,
        provider_type=payload.provider_type,
        is_registered_partner=payload.is_registered_partner,
        location_name=payload.location_name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        contact_person=payload.contact_person,
        phone=payload.phone,
        service_capabilities=payload.service_capabilities,
        estimated_base_charge=payload.estimated_base_charge,
        is_active=True,
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider


@app.post("/api/providers/enquiries", response_model=ProviderEnquiryResponse, status_code=status.HTTP_201_CREATED, tags=["Providers"])
def create_enquiry(
    payload: ProviderEnquiryCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Record simulated coordinator enquiry with external hospital/ambulance partner."""
    enquiry = crud.create_provider_enquiry(
        db=db,
        incident_id=payload.incident_id,
        provider_id=payload.provider_id,
        charge_quote=payload.charge_quote or 0.0,
        subsidy_amount=payload.subsidy_amount or 0.0,
        user_consent=payload.user_consent or "Pending",
        response_time_minutes=payload.response_time_minutes or 15,
        notes=payload.notes,
    )
    return enquiry


@app.patch("/api/providers/enquiries/{enquiry_id}", response_model=ProviderEnquiryResponse, tags=["Providers"])
def update_enquiry_consent(
    enquiry_id: int,
    payload: ProviderEnquiryUpdate,
    db: Session = Depends(get_db),
):
    """Update external enquiry status, recorded quote, or user consent."""
    updated = crud.update_provider_enquiry(
        db=db,
        enquiry_id=enquiry_id,
        status_val=payload.status,
        user_consent=payload.user_consent,
        charge_quote=payload.charge_quote,
        notes=payload.notes,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Provider enquiry record not found.")
    return updated


# ==============================================================================
# Notifications & Feedback Routes
# ==============================================================================
@app.get("/api/notifications", response_model=List[NotificationResponse], tags=["Notifications"])
def get_notifications(
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    return crud.get_user_notifications(db, user_id=user_id)


@app.patch("/api/notifications/{notification_id}/read", tags=["Notifications"])
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    success = crud.mark_notification_read(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"status": "success"}


@app.get("/api/admin/notifications", response_model=List[NotificationResponse], tags=["Notifications"])
def get_admin_notifications_route(
    unread_only: bool = Query(False),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retrieve persistent coordinator notifications."""
    return crud.get_admin_notifications(db, unread_only=unread_only)


@app.patch("/api/admin/notifications/{notification_id}/read", tags=["Notifications"])
def mark_admin_read(
    notification_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Mark an individual coordinator notification as read."""
    success = crud.mark_notification_read(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"status": "success"}


@app.post("/api/admin/notifications/mark-all-read", tags=["Notifications"])
def mark_all_admin_read(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Mark all coordinator notifications as read."""
    count = crud.mark_all_admin_notifications_read(db)
    return {"status": "success", "count": count}


@app.post("/api/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED, tags=["Feedback"])
def submit_incident_feedback(
    payload: FeedbackCreate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Submit post-resolution rating and tags."""
    try:
        user_id = current_user.id if current_user else None
        return crud.submit_feedback(
            db=db,
            incident_id=payload.incident_id,
            rating=payload.rating,
            tags=payload.tags,
            comments=payload.comments,
            user_id=user_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/feedback", response_model=List[FeedbackResponse], tags=["Feedback"])
def list_feedback(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return crud.get_feedback_list(db)


# ==============================================================================
# Chatbot & Simulation Routes
# ==============================================================================
@app.post("/api/chatbot/message", response_model=ChatbotMessageResponse, tags=["Chatbot"])
def chat_with_sahara(payload: ChatbotMessageRequest, db: Session = Depends(get_db)):
    """Communicate with Sahara, the caring emergency support companion."""
    session_id = payload.session_id or "default_session"
    result = process_sahara_message(
        payload.message,
        session_id,
        db,
        user_name=payload.user_name,
        lang=payload.lang,
    )
    return ChatbotMessageResponse(**result)


@app.get("/api/admin/analytics", tags=["Analytics"])
def get_analytics(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Command centre metrics and KPIs."""
    return crud.get_platform_analytics(db)


@app.get("/api/admin/predictions", tags=["Analytics"])
def get_shortage_predictions(
    zone: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Predict resource shortage risk by geographic zone."""
    return predict_resource_shortage_risk(db, zone_name=zone)


@app.post("/api/simulation/reset", tags=["Simulation"])
def reset_simulation(db: Session = Depends(get_db)):
    """Reset the database to clean demo state for repeatable presentation."""
    # Delete all records and reseed
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    crud.seed_demo_data(db)
    return {"status": "success", "message": "Demo data successfully reset to clean state."}


# ==============================================================================
# Legacy Compatibility Routes (Ensures all existing tests pass 100%)
# ==============================================================================
@app.get("/api/stats", response_model=StatsResponse, tags=["Analytics"])
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)


@app.get("/api/emergencies", response_model=List[EmergencyResponse], tags=["Emergencies"])
def list_emergencies(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    db: Session = Depends(get_db),
):
    return crud.get_emergencies(db, status=status_filter, priority=priority_filter)


@app.get("/api/emergencies/{emergency_id}", response_model=EmergencyResponse, tags=["Emergencies"])
def get_emergency(emergency_id: int, db: Session = Depends(get_db)):
    item = crud.get_emergency_by_id(db, emergency_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return item


@app.post("/api/emergencies", response_model=EmergencyResponse, status_code=status.HTTP_201_CREATED, tags=["Emergencies"])
def create_emergency(payload: EmergencyCreate, db: Session = Depends(get_db)):
    return crud.create_emergency(db, payload)


@app.patch("/api/emergencies/{emergency_id}/status", response_model=EmergencyResponse, tags=["Emergencies"])
def update_emergency_status(
    emergency_id: int, payload: EmergencyUpdateStatus, db: Session = Depends(get_db)
):
    updated = crud.update_emergency_status(db, emergency_id, payload.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return updated


@app.delete("/api/emergencies/{emergency_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Emergencies"])
def delete_emergency(emergency_id: int, db: Session = Depends(get_db)):
    success = crud.delete_emergency(db, emergency_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return None
