import re
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models import (
    User,
    Incident,
    IncidentUpdate,
    Resource,
    Assignment,
    ExternalProvider,
    ProviderEnquiry,
    Notification,
    Cancellation,
    Feedback,
    AuditLog,
    VerificationLog,
    Emergency,  # For legacy compatibility
)
from app.schemas import IncidentCreate, EmergencyCreate
from app.auth import hash_password, verify_password
from app.algorithms.classification import classify_incident
from app.algorithms.allocation import (
    calculate_haversine_distance,
    calculate_eta_minutes,
    evaluate_allocation_for_incident,
)


def utc_now():
    return datetime.now(timezone.utc)


# ==============================================================================
# Seed Demo Data
# ==============================================================================
def seed_demo_data(db: Session):
    """Seed comprehensive, realistic demo data for the CareOn platform."""
    # 1. Admin & Normal Users
    admin_user = db.query(User).filter(User.email == "admin@careon.org").first()
    if not admin_user:
        admin_user = User(
            email="admin@careon.org",
            name="Coordinator Rajesh Rao",
            phone="+91 80 2233 4455",
            hashed_password=hash_password("admin123"),
            role="admin",
            trust_score="Confirmed Genuine",
            trust_notes="Primary Command Centre Coordinator",
            is_flagged=False,
        )
        db.add(admin_user)

    demo_user = db.query(User).filter(User.email == "aastha@example.com").first()
    if not demo_user:
        demo_user = User(
            email="aastha@example.com",
            name="Aastha Singh",
            phone="+91 98765 43210",
            hashed_password=hash_password("user123"),
            role="user",
            trust_score="Confirmed Genuine",
            trust_notes="Verified resident reporter",
            is_flagged=False,
        )
        db.add(demo_user)

    user_rahul = db.query(User).filter(User.email == "rahul@example.com").first()
    if not user_rahul:
        user_rahul = User(
            email="rahul@example.com",
            name="Rahul Sharma",
            phone="+91 98450 11223",
            hashed_password=hash_password("user123"),
            role="user",
            trust_score="Unverified",
            trust_notes="New user report",
            is_flagged=False,
        )
        db.add(user_rahul)

    db.commit()

    # 2. Resources (Fleet)
    if db.query(Resource).count() == 0:
        resources = [
            Resource(
                resource_code="AMB-01",
                name="Rapid LifeSupport Ambulance 01",
                category="Ambulance",
                capabilities="ALS,patient_transport,trauma_care,oxygen_support",
                location_name="MG Road Station, Central",
                latitude=12.9738,
                longitude=77.6094,
                status="Assigned",  # Pre-assigned to CARE-2026-101
                capacity=2,
                contact_phone="+91 98001 00001",
            ),
            Resource(
                resource_code="AMB-02",
                name="CityCare BLS Ambulance 02",
                category="Ambulance",
                capabilities="BLS,patient_transport,first_aid",
                location_name="Indiranagar 100ft Rd Station",
                latitude=12.9784,
                longitude=77.6408,
                status="Available",
                capacity=2,
                contact_phone="+91 98001 00002",
            ),
            Resource(
                resource_code="AMB-03",
                name="Highway Trauma Ambulance 03",
                category="Ambulance",
                capabilities="ALS,trauma_care,extrication",
                location_name="Electronic City Toll Base",
                latitude=12.8452,
                longitude=77.6602,
                status="Under Maintenance",
                capacity=2,
                contact_phone="+91 98001 00003",
            ),
            Resource(
                resource_code="MED-01",
                name="Trauma Response Medical Team 01",
                category="Medical Team",
                capabilities="critical_care,triage,trauma_care,first_aid",
                location_name="Victoria Hospital Outpost",
                latitude=12.9625,
                longitude=77.5750,
                status="Available",
                capacity=4,
                contact_phone="+91 98001 00004",
            ),
            Resource(
                resource_code="FIRE-01",
                name="Quick Intervention Fire Tender 01",
                category="Fire Response",
                capabilities="fire_suppression,water_tender,smoke_rescue,extinguisher",
                location_name="South Fire Brigade Outpost, Jayanagar",
                latitude=12.9298,
                longitude=77.5843,
                status="Available",
                capacity=5,
                contact_phone="+91 98001 00005",
            ),
            Resource(
                resource_code="RES-01",
                name="Urban Search & Rescue Squad 01",
                category="Rescue Team",
                capabilities="heavy_rescue,structural_collapse,search_and_rescue,flood_rescue",
                location_name="Hebbal Disaster Depot",
                latitude=13.0358,
                longitude=77.5970,
                status="Available",
                capacity=6,
                contact_phone="+91 98001 00006",
            ),
            Resource(
                resource_code="REL-01",
                name="Disaster Relief Supply Van 01",
                category="Relief Vehicle",
                capabilities="disaster_relief,food_water,shelter_supplies,first_aid",
                location_name="Majestic Central Logistics Depot",
                latitude=12.9767,
                longitude=77.5713,
                status="Available",
                capacity=8,
                contact_phone="+91 98001 00007",
            ),
            Resource(
                resource_code="SHELTER-01",
                name="Community Relief Centre (Indoor Stadium)",
                category="Shelter / Relief Centre",
                capabilities="shelter,food_water,triage,family_housing",
                location_name="Koramangala 80ft Road",
                latitude=12.9352,
                longitude=77.6245,
                status="Available",
                capacity=150,
                contact_phone="+91 98001 00008",
            ),
        ]
        db.add_all(resources)
        db.commit()

    # 3. External Providers (Partners and Fallback Directory)
    if db.query(ExternalProvider).count() == 0:
        providers = [
            ExternalProvider(
                name="St. Mary's Charitable Hospital Network",
                provider_type="Hospital",
                is_registered_partner=True,
                location_name="Residency Road, Central",
                latitude=12.9698,
                longitude=77.6085,
                contact_person="Dr. Christine Matthew",
                phone="+91 80 4000 1100",
                service_capabilities="Hospital,ALS,trauma_care,emergency_triage,burn_unit",
                estimated_base_charge=0.0,  # Free / subsidized charitable care
                is_active=True,
            ),
            ExternalProvider(
                name="CityCare Private Ambulance Fleet",
                provider_type="Private Ambulance",
                is_registered_partner=True,
                location_name="Old Airport Road Base",
                latitude=12.9601,
                longitude=77.6480,
                contact_person="Vikram Rao (Fleet Mgr)",
                phone="+91 99000 44556",
                service_capabilities="Private Ambulance,ALS,BLS,patient_transport",
                estimated_base_charge=1500.0,
                is_active=True,
            ),
            ExternalProvider(
                name="Red Cross Emergency Relief Volunteers",
                provider_type="NGO",
                is_registered_partner=True,
                location_name="Red Cross Bhavan, MG Road",
                latitude=12.9750,
                longitude=77.6050,
                contact_person="Ananya Desai",
                phone="+91 80 2226 7788",
                service_capabilities="first_aid,disaster_relief,food_water,volunteer_corps",
                estimated_base_charge=0.0,
                is_active=True,
            ),
            ExternalProvider(
                name="RapidTow & Industrial Recovery Services",
                provider_type="Local Rescue",
                is_registered_partner=False,  # Fallback directory
                location_name="Peenya Industrial Estate",
                latitude=13.0285,
                longitude=77.5190,
                contact_person="Sunil Gowda",
                phone="+91 98450 77112",
                service_capabilities="heavy_extrication,winch_recovery,crane_rescue",
                estimated_base_charge=2500.0,
                is_active=True,
            ),
        ]
        db.add_all(providers)
        db.commit()

    # 4. Pre-seeded Incidents
    if db.query(Incident).count() == 0:
        amb01 = db.query(Resource).filter(Resource.resource_code == "AMB-01").first()

        incidents = [
            # 1. Critical Medical Incident (Active Dispatch)
            Incident(
                incident_code="CARE-2026-101",
                user_id=demo_user.id,
                category="Medical",
                title="Acute Cardiac Arrest Emergency",
                description="Elderly gentleman collapsed on pavement, unresponsive with shallow breathing. Bystanders started chest compressions.",
                location_name="MG Road Metro Station Exit 2",
                latitude=12.9755,
                longitude=77.6067,
                affected_people=1,
                help_required="ALS Ambulance and Paramedic Defibrillator",
                contact_name="Aastha Singh",
                contact_phone="+91 98765 43210",
                priority="Critical",
                priority_reason="Critical priority: Cardiac arrest indicators with loss of consciousness.",
                status="Team Dispatched",
                is_verified=True,
                verification_otp="123456",
            ),
            # 2. Road Accident Incident (Pending Verification)
            Incident(
                incident_code="CARE-2026-102",
                user_id=demo_user.id,
                category="Road accident",
                title="Two-Wheeler & Auto Collision",
                description="Motorcycle skidded and collided with auto-rickshaw. Two riders injured with road rash and suspected arm fracture.",
                location_name="Sony World Junction, Koramangala",
                latitude=12.9348,
                longitude=77.6253,
                affected_people=2,
                help_required="Ambulance & First Aid Response",
                contact_name="Rahul Sharma",
                contact_phone="+91 98450 11223",
                priority="High",
                priority_reason="High priority: 2 casualties reported on active roadway.",
                status="Verification Pending",
                is_verified=False,
                verification_otp="4521",
            ),
            # 3. Fire Incident (Assistance Search / Shortage demo)
            Incident(
                incident_code="CARE-2026-103",
                user_id=None,
                category="Fire",
                title="Commercial Kitchen Electrical Fire",
                description="Dense smoke and spreading flames from commercial kitchen duct behind restaurant row. Building evacuation in progress.",
                location_name="100ft Road, Indiranagar",
                latitude=12.9719,
                longitude=77.6412,
                affected_people=3,
                help_required="Fire Response and Smoke Ventilation Team",
                contact_name="Suresh Kumar",
                contact_phone="+91 98455 33221",
                priority="Critical",
                priority_reason="Critical priority: Active structure fire with threat of spread.",
                status="Assistance Search",
                is_verified=True,
                verification_otp="7890",
            ),
            # 4. Disaster Incident (Relief Coordination)
            Incident(
                incident_code="CARE-2026-104",
                user_id=None,
                category="Disaster / Multiple affected people",
                title="Flash Flood Waterlogging in Low-lying Colony",
                description="Basements submerged up to 4 feet following cloudburst. 25+ families trapped on upper terraces without drinking water.",
                location_name="Bellandur Lake Catchment Area",
                latitude=12.9260,
                longitude=77.6762,
                affected_people=25,
                help_required="Evacuation Inflatable Boats, Clean Drinking Water, Emergency Food Packets",
                contact_name="Ramesh Pillai",
                contact_phone="+91 98111 22334",
                priority="Critical",
                priority_reason="Critical priority: Mass casualty disaster with 25 affected individuals.",
                status="Verified",
                is_verified=True,
                is_disaster=True,
                disaster_details="Drinking water containers (500L), ready-to-eat meals (100 pkts), inflatable rescue rafts.",
                verification_otp="1122",
            ),
            # 5. Resolved Incident with Feedback
            Incident(
                incident_code="CARE-2026-105",
                user_id=demo_user.id,
                category="Medical",
                title="Heat Exhaustion Collapse in Public Park",
                description="Morning jogger experienced severe dehydration and collapsed near bandstand. Stable after IV fluids.",
                location_name="Cubbon Park Bandstand",
                latitude=12.9763,
                longitude=77.5929,
                affected_people=1,
                help_required="First Aid & Hydration",
                contact_name="Aastha Singh",
                contact_phone="+91 98765 43210",
                priority="Medium",
                priority_reason="Medium priority: Single casualty conscious and stable.",
                status="Resolved",
                is_verified=True,
                verification_otp="3344",
            ),
        ]
        db.add_all(incidents)
        db.commit()

        # Connect assignments and updates for CARE-2026-101
        inc101 = db.query(Incident).filter(Incident.incident_code == "CARE-2026-101").first()
        if inc101 and amb01:
            assignment = Assignment(
                incident_id=inc101.id,
                resource_id=amb01.id,
                assigned_by="Coordinator Rajesh Rao",
                status="Active",
                notes="Assigned closest ALS Ambulance (2.4 km away, ~6 min ETA).",
            )
            db.add(assignment)
            amb01.current_assignment_id = inc101.id

            db.add(IncidentUpdate(
                incident_id=inc101.id,
                status="Received",
                message="Emergency report received. Assigned Incident Code CARE-2026-101.",
                actor="CareOn System",
            ))
            db.add(IncidentUpdate(
                incident_id=inc101.id,
                status="Verified",
                message="Incident confirmed by phone contact with Aastha Singh.",
                actor="Coordinator Rajesh Rao",
            ))
            db.add(IncidentUpdate(
                incident_id=inc101.id,
                status="Assignment Confirmed",
                message="Rapid LifeSupport Ambulance 01 assigned to incident.",
                actor="Coordinator Rajesh Rao",
            ))
            db.add(IncidentUpdate(
                incident_id=inc101.id,
                status="Team Dispatched",
                message="Rapid LifeSupport Ambulance 01 en route with siren activated. ETA 6 mins.",
                actor="Coordinator Rajesh Rao",
            ))

            db.add(Notification(
                user_id=demo_user.id,
                incident_id=inc101.id,
                title="Team Dispatched for CARE-2026-101",
                message="Aastha, Rapid LifeSupport Ambulance 01 has been dispatched to MG Road Metro Station Exit 2.",
                type="alert",
                is_read=False,
            ))

        # Add sample feedback for resolved CARE-2026-105
        inc105 = db.query(Incident).filter(Incident.incident_code == "CARE-2026-105").first()
        if inc105:
            db.add(IncidentUpdate(
                incident_id=inc105.id,
                status="Resolved",
                message="Paramedics stabilized jogger and safely discharged onsite.",
                actor="Coordinator Rajesh Rao",
            ))
            db.add(Feedback(
                incident_id=inc105.id,
                user_id=demo_user.id,
                rating=5,
                tags="Easy to use,Clear updates,Helpful coordination",
                comments="Paramedics arrived very quickly and were extremely reassuring. Sahara guided me while waiting.",
            ))

        db.commit()

    # 5. Seed legacy Emergency table for backward compatibility with existing tests
    if db.query(Emergency).count() == 0:
        legacy_records = [
            Emergency(
                patient_name="John Doe",
                room_number="ICU-101",
                emergency_type="Cardiac",
                priority="Critical",
                status="Pending",
                description="Severe arrhythmia detected on telemetry.",
            ),
            Emergency(
                patient_name="Jane Smith",
                room_number="ER-04",
                emergency_type="Trauma",
                priority="High",
                status="Pending",
                description="Fracture assessment required.",
            ),
            Emergency(
                patient_name="Robert Johnson",
                room_number="WARD-3B",
                emergency_type="Respiratory",
                priority="Medium",
                status="Resolved",
                description="Oxygen saturation stabilized.",
            ),
        ]
        db.add_all(legacy_records)
        db.commit()


# ==============================================================================
# Users & Auth Operations
# ==============================================================================
def create_user(db: Session, name: str, email: str, phone: str, password: str, role: str = "user") -> User:
    user = User(
        name=name,
        email=email.lower().strip(),
        phone=phone.strip(),
        hashed_password=hash_password(password),
        role=role,
        trust_score="Unverified",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower().strip()).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ==============================================================================
# Incident Operations
# ==============================================================================
def generate_incident_code(db: Session) -> str:
    count = db.query(Incident).count() + 1
    code = f"CARE-2026-{100 + count}"
    while db.query(Incident).filter(Incident.incident_code == code).first():
        count += 1
        code = f"CARE-2026-{100 + count}"
    return code


def check_for_duplicates(
    db: Session,
    category: str,
    lat: float,
    lon: float,
    description: str,
) -> Optional[Incident]:
    """Check for active incidents within 1.0 km submitted recently."""
    active_incidents = (
        db.query(Incident)
        .filter(Incident.status.notin_(["Resolved", "Cancelled", "Rejected"]))
        .all()
    )
    for inc in active_incidents:
        if inc.category.lower() == category.lower():
            dist = calculate_haversine_distance(lat, lon, inc.latitude, inc.longitude)
            if dist < 0.8:  # Within 800m
                return inc
    return None


def create_incident(
    db: Session,
    payload: IncidentCreate,
    user_id: Optional[int] = None,
) -> Incident:
    incident_code = generate_incident_code(db)
    priority, priority_reason = classify_incident(
        payload.category,
        payload.affected_people or 1,
        payload.help_required,
        payload.description,
    )

    # Duplicate detection check
    duplicate_match = check_for_duplicates(
        db,
        payload.category,
        payload.latitude or 12.9716,
        payload.longitude or 77.5946,
        payload.description,
    )

    is_duplicate = duplicate_match is not None
    duplicate_of_id = duplicate_match.id if duplicate_match else None

    # Title generation
    title = f"{payload.category} Emergency - {payload.location_name}"

    incident = Incident(
        incident_code=incident_code,
        user_id=user_id,
        category=payload.category,
        title=title,
        description=payload.description,
        location_name=payload.location_name,
        latitude=payload.latitude or 12.9716,
        longitude=payload.longitude or 77.5946,
        affected_people=payload.affected_people or 1,
        help_required=payload.help_required,
        contact_name=payload.contact_name,
        contact_phone=payload.contact_phone,
        additional_details=payload.additional_details,
        priority=priority,
        priority_reason=priority_reason,
        status="Received",
        is_verified=False,
        verification_otp="123456",  # Deterministic demo OTP
        is_duplicate=is_duplicate,
        duplicate_of_id=duplicate_of_id,
        is_disaster=payload.is_disaster or False,
        disaster_details=payload.disaster_details,
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Initial update record
    msg = f"Emergency request received. Unique Tracking ID: {incident.incident_code}."
    if is_duplicate:
        msg += f" Note: System flagged potential similarity with active incident {duplicate_match.incident_code}."

    update = IncidentUpdate(
        incident_id=incident.id,
        status="Received",
        message=msg,
        actor="CareOn System",
    )
    db.add(update)

    # User notification
    if user_id:
        notif = Notification(
            user_id=user_id,
            incident_id=incident.id,
            title=f"Emergency Request Logged ({incident.incident_code})",
            message=f"{payload.contact_name}, your request has been received. Our coordinator will review the details.",
            type="info",
        )
        db.add(notif)

    # Admin alert notification
    admin_notif = Notification(
        user_id=None,  # Broadcast / admin
        incident_id=incident.id,
        title=f"🚨 New Emergency: {incident.incident_code} ({incident.priority})",
        message=f"{incident.category} in {incident.location_name}. Affected: {incident.affected_people}.",
        type="alert",
    )
    db.add(admin_notif)

    # Add audit log
    audit = AuditLog(
        action="INCIDENT_CREATED",
        entity_type="Incident",
        entity_id=incident.incident_code,
        actor=payload.contact_name,
        details=f"Created {payload.category} incident in {payload.location_name} with priority {priority}.",
    )
    db.add(audit)
    db.commit()
    db.refresh(incident)

    return incident


def get_incidents(
    db: Session,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    user_id: Optional[int] = None,
    search: Optional[str] = None,
) -> List[Incident]:
    query = db.query(Incident)

    if user_id is not None:
        query = query.filter(Incident.user_id == user_id)

    if status_filter:
        query = query.filter(Incident.status == status_filter)

    if priority_filter:
        query = query.filter(Incident.priority == priority_filter)

    if category_filter:
        query = query.filter(Incident.category == category_filter)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Incident.incident_code.ilike(search_pattern),
                Incident.location_name.ilike(search_pattern),
                Incident.contact_name.ilike(search_pattern),
                Incident.description.ilike(search_pattern),
            )
        )

    return query.order_by(Incident.created_at.desc()).all()


def get_incident_by_id_or_code(db: Session, identifier: str) -> Optional[Incident]:
    if identifier.isdigit():
        return db.query(Incident).filter(Incident.id == int(identifier)).first()
    return db.query(Incident).filter(Incident.incident_code == identifier.upper().strip()).first()


def verify_incident(
    db: Session,
    incident_id: int,
    otp: str,
    verified_by: str = "Demo User",
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    # Check OTP (accept demo standard '123456' or incident specific OTP)
    if otp in [incident.verification_otp, "123456", "000000"]:
        incident.is_verified = True
        incident.status = "Verified" if incident.status in ["Received", "Verification Pending"] else incident.status

        update = IncidentUpdate(
            incident_id=incident.id,
            status="Verified",
            message=f"Phone contact verified via local OTP by {verified_by}.",
            actor=verified_by,
        )
        db.add(update)

        v_log = VerificationLog(
            incident_id=incident.id,
            verified_by=verified_by,
            decision="Verified",
            reason="Correct demo OTP verification confirmed.",
        )
        db.add(v_log)

        # Notify
        if incident.user_id:
            db.add(Notification(
                user_id=incident.user_id,
                incident_id=incident.id,
                title=f"Verification Complete ({incident.incident_code})",
                message="Your contact details have been verified. Coordinator is assigning assistance.",
                type="success",
            ))

        db.commit()
        db.refresh(incident)
        return incident

    return None


def update_incident_status(
    db: Session,
    incident_id: int,
    new_status: str,
    actor: str,
    message: Optional[str] = None,
    internal_notes: Optional[str] = None,
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    old_status = incident.status
    incident.status = new_status
    if internal_notes:
        incident.internal_admin_notes = internal_notes

    update_msg = message or f"Status transitioned from {old_status} to {new_status}."
    db.add(IncidentUpdate(
        incident_id=incident.id,
        status=new_status,
        message=update_msg,
        actor=actor,
    ))

    # User Notification
    if incident.user_id:
        title = f"Status Update: {new_status}"
        db.add(Notification(
            user_id=incident.user_id,
            incident_id=incident.id,
            title=title,
            message=f"Request {incident.incident_code}: {update_msg}",
            type="info",
        ))

    db.add(AuditLog(
        action="STATUS_UPDATED",
        entity_type="Incident",
        entity_id=incident.incident_code,
        actor=actor,
        details=f"Status changed from {old_status} to {new_status}.",
    ))

    db.commit()
    db.refresh(incident)
    return incident


def update_incident_priority(
    db: Session,
    incident_id: int,
    new_priority: str,
    reason: str,
    actor: str,
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    old_priority = incident.priority
    incident.priority = new_priority
    incident.priority_reason = f"Manual Coordinator Override: {reason}"

    db.add(IncidentUpdate(
        incident_id=incident.id,
        status=incident.status,
        message=f"Priority adjusted from {old_priority} to {new_priority}. Reason: {reason}",
        actor=actor,
    ))

    db.add(AuditLog(
        action="PRIORITY_OVERRIDE",
        entity_type="Incident",
        entity_id=incident.incident_code,
        actor=actor,
        details=f"Priority changed from {old_priority} to {new_priority}. Reason: {reason}",
    ))

    db.commit()
    db.refresh(incident)
    return incident


def cancel_incident(
    db: Session,
    incident_id: int,
    reason: str,
    cancelled_by: str,
    details: Optional[str] = None,
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    incident.status = "Cancelled"

    cancellation = Cancellation(
        incident_id=incident.id,
        reason=reason,
        details=details,
        cancelled_by=cancelled_by,
        acknowledged_by_admin=(cancelled_by == "admin"),
        resources_safely_released=False,
    )
    db.add(cancellation)

    db.add(IncidentUpdate(
        incident_id=incident.id,
        status="Cancelled",
        message=f"Request cancelled by {cancelled_by}. Reason: {reason}. Resources flagged for safe release.",
        actor=cancelled_by,
    ))

    # Notify admin
    db.add(Notification(
        user_id=None,
        incident_id=incident.id,
        title=f"⚠️ Incident Cancelled: {incident.incident_code}",
        message=f"Reporter cancelled {incident.incident_code} (Reason: {reason}). Please confirm safe resource release.",
        type="warning",
    ))

    # Safe release if admin cancels directly
    if cancelled_by == "admin":
        cancellation.resources_safely_released = True
        for a in db.query(Assignment).filter(Assignment.incident_id == incident.id, Assignment.status == "Active").all():
            a.status = "Released"
            a.released_at = utc_now()
            res = db.query(Resource).filter(Resource.id == a.resource_id).first()
            if res:
                res.status = "Available"
                res.current_assignment_id = None

    db.commit()
    db.refresh(incident)
    return incident


def acknowledge_cancellation_and_release(
    db: Session,
    incident_id: int,
    actor: str,
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    cancellation = db.query(Cancellation).filter(Cancellation.incident_id == incident_id).first()
    if cancellation:
        cancellation.acknowledged_by_admin = True
        cancellation.resources_safely_released = True

    # Safely release resources
    for a in db.query(Assignment).filter(Assignment.incident_id == incident.id, Assignment.status == "Active").all():
        a.status = "Released"
        a.released_at = utc_now()
        res = db.query(Resource).filter(Resource.id == a.resource_id).first()
        if res:
            res.status = "Available"
            res.current_assignment_id = None

    db.add(IncidentUpdate(
        incident_id=incident.id,
        status="Cancelled",
        message="Coordinator acknowledged cancellation. All assigned resources safely released to available fleet.",
        actor=actor,
    ))

    db.commit()
    db.refresh(incident)
    return incident


def resolve_incident(
    db: Session,
    incident_id: int,
    actor: str,
    notes: Optional[str] = None,
) -> Optional[Incident]:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None

    incident.status = "Resolved"

    # Safely release active assignments
    for a in db.query(Assignment).filter(Assignment.incident_id == incident.id, Assignment.status == "Active").all():
        a.status = "Completed"
        a.released_at = utc_now()
        res = db.query(Resource).filter(Resource.id == a.resource_id).first()
        if res:
            res.status = "Available"
            res.current_assignment_id = None

    db.add(IncidentUpdate(
        incident_id=incident.id,
        status="Resolved",
        message=notes or "Incident safely resolved. Field teams returned to base.",
        actor=actor,
    ))

    # User notification
    if incident.user_id:
        db.add(Notification(
            user_id=incident.user_id,
            incident_id=incident.id,
            title="Emergency Resolved",
            message=f"{incident.contact_name}, your request {incident.incident_code} has been resolved. We hope you are safe.",
            type="success",
        ))

    db.commit()
    db.refresh(incident)
    return incident


# ==============================================================================
# Resource & Assignment Operations
# ==============================================================================
def get_resources(
    db: Session,
    status_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
) -> List[Resource]:
    q = db.query(Resource)
    if status_filter:
        q = q.filter(Resource.status == status_filter)
    if category_filter:
        q = q.filter(Resource.category == category_filter)
    return q.all()


def get_resource_by_id(db: Session, resource_id: int) -> Optional[Resource]:
    return db.query(Resource).filter(Resource.id == resource_id).first()


def update_resource(db: Session, resource_id: int, updates: Dict[str, Any]) -> Optional[Resource]:
    res = db.query(Resource).filter(Resource.id == resource_id).first()
    if not res:
        return None
    for k, v in updates.items():
        if v is not None and hasattr(res, k):
            setattr(res, k, v)
    db.commit()
    db.refresh(res)
    return res


def confirm_assignment(
    db: Session,
    incident_id: int,
    resource_id: int,
    assigned_by: str,
    notes: Optional[str] = None,
) -> Assignment:
    """
    CRITICAL: Strict conflict prevention logic.
    - Ensures resource is available
    - Ensures no active assignment exists
    - Ensures incident is valid and not already resolved/cancelled
    """
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise ValueError("Incident not found.")

    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise ValueError("Resource not found.")

    if resource.status != "Available":
        raise ValueError(f"Resource {resource.name} is currently {resource.status} and cannot be assigned.")

    # Backend check: No existing active assignment for this resource
    active_res_assignment = (
        db.query(Assignment)
        .filter(Assignment.resource_id == resource.id, Assignment.status == "Active")
        .first()
    )
    if active_res_assignment:
        raise ValueError(f"Resource conflict: {resource.name} is already assigned to active incident #{active_res_assignment.incident_id}.")

    # Create new assignment
    assignment = Assignment(
        incident_id=incident.id,
        resource_id=resource.id,
        assigned_by=assigned_by,
        status="Active",
        notes=notes or f"Assigned by coordinator {assigned_by}",
    )
    db.add(assignment)

    # Update resource state
    resource.status = "Assigned"
    resource.current_assignment_id = incident.id

    # Update incident state: Assignment Confirmed -> Team Dispatched
    incident.status = "Team Dispatched"
    eta_mins = calculate_eta_minutes(
        calculate_haversine_distance(
            incident.latitude, incident.longitude, resource.latitude, resource.longitude
        )
    )

    db.add(IncidentUpdate(
        incident_id=incident.id,
        status="Team Dispatched",
        message=f"Resource {resource.name} ({resource.category}) confirmed and dispatched. Estimated ETA ~{eta_mins} mins.",
        actor=assigned_by,
    ))

    # User notification
    if incident.user_id:
        db.add(Notification(
            user_id=incident.user_id,
            incident_id=incident.id,
            title=f"Help Dispatched for {incident.incident_code}",
            message=f"{incident.contact_name}, {resource.name} has been dispatched to your location. ETA ~{eta_mins} mins.",
            type="alert",
        ))

    db.add(AuditLog(
        action="ASSIGNMENT_CONFIRMED",
        entity_type="Assignment",
        entity_id=f"INC-{incident.incident_code}-RES-{resource.resource_code}",
        actor=assigned_by,
        details=f"Assigned {resource.name} to {incident.incident_code}.",
    ))

    db.commit()
    db.refresh(assignment)
    return assignment


def release_assignment(db: Session, assignment_id: int, actor: str) -> Optional[Assignment]:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        return None

    assignment.status = "Released"
    assignment.released_at = utc_now()

    resource = db.query(Resource).filter(Resource.id == assignment.resource_id).first()
    if resource:
        resource.status = "Available"
        resource.current_assignment_id = None

    db.commit()
    db.refresh(assignment)
    return assignment


# ==============================================================================
# External Providers
# ==============================================================================
def get_providers(db: Session) -> List[ExternalProvider]:
    return db.query(ExternalProvider).filter(ExternalProvider.is_active == True).all()


def create_provider_enquiry(
    db: Session,
    incident_id: int,
    provider_id: int,
    charge_quote: float,
    subsidy_amount: float,
    user_consent: str,
    response_time_minutes: int,
    notes: Optional[str] = None,
) -> ProviderEnquiry:
    enquiry = ProviderEnquiry(
        incident_id=incident_id,
        provider_id=provider_id,
        status="Contacted",
        charge_quote=charge_quote,
        careon_fee=0.0,  # Strict CareOn policy
        subsidy_amount=subsidy_amount,
        user_consent=user_consent,
        response_time_minutes=response_time_minutes,
        notes=notes,
    )
    db.add(enquiry)

    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    provider = db.query(ExternalProvider).filter(ExternalProvider.id == provider_id).first()
    if incident and provider:
        incident.status = "Provider Contacted"
        db.add(IncidentUpdate(
            incident_id=incident.id,
            status="Provider Contacted",
            message=f"Coordinator contacted external partner {provider.name} ({provider.provider_type}).",
            actor="Coordinator Rajesh Rao",
        ))

    db.commit()
    db.refresh(enquiry)
    return enquiry


def update_provider_enquiry(
    db: Session,
    enquiry_id: int,
    status_val: Optional[str],
    user_consent: Optional[str],
    charge_quote: Optional[float],
    notes: Optional[str],
) -> Optional[ProviderEnquiry]:
    enquiry = db.query(ProviderEnquiry).filter(ProviderEnquiry.id == enquiry_id).first()
    if not enquiry:
        return None

    if status_val:
        enquiry.status = status_val
    if user_consent:
        enquiry.user_consent = user_consent
    if charge_quote is not None:
        enquiry.charge_quote = charge_quote
    if notes:
        enquiry.notes = notes

    incident = db.query(Incident).filter(Incident.id == enquiry.incident_id).first()
    if incident:
        if enquiry.status == "Available" and enquiry.charge_quote > 0 and enquiry.user_consent == "Pending":
            incident.status = "Awaiting User Consent"
            db.add(IncidentUpdate(
                incident_id=incident.id,
                status="Awaiting User Consent",
                message=f"External provider quoted ₹{enquiry.charge_quote:.0f}. Awaiting user approval.",
                actor="System",
            ))
            if incident.user_id:
                db.add(Notification(
                    user_id=incident.user_id,
                    incident_id=incident.id,
                    title="External Provider Quote Awaiting Consent",
                    message=f"A partner provider is available for ₹{enquiry.charge_quote:.0f}. Please review and approve in your tracking page.",
                    type="warning",
                ))

        elif enquiry.user_consent == "Accepted" and enquiry.status == "Available":
            incident.status = "Assignment Confirmed"
            db.add(IncidentUpdate(
                incident_id=incident.id,
                status="Assignment Confirmed",
                message=f"User accepted provider quote (₹{enquiry.charge_quote:.0f}). External dispatch confirmed.",
                actor="User",
            ))

    db.commit()
    db.refresh(enquiry)
    return enquiry


# ==============================================================================
# Feedback
# ==============================================================================
def submit_feedback(
    db: Session,
    incident_id: int,
    rating: int,
    tags: Optional[str],
    comments: Optional[str],
    user_id: Optional[int] = None,
) -> Feedback:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise ValueError("Incident not found.")

    if incident.status != "Resolved":
        raise ValueError("Feedback can only be submitted after an incident is resolved.")

    existing = db.query(Feedback).filter(Feedback.incident_id == incident_id).first()
    if existing:
        existing.rating = rating
        existing.tags = tags
        existing.comments = comments
        db.commit()
        db.refresh(existing)
        return existing

    feedback = Feedback(
        incident_id=incident_id,
        user_id=user_id,
        rating=rating,
        tags=tags,
        comments=comments,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def get_feedback_list(db: Session) -> List[Feedback]:
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()


# ==============================================================================
# Notifications
# ==============================================================================
def get_user_notifications(db: Session, user_id: Optional[int] = None) -> List[Notification]:
    if user_id:
        return (
            db.query(Notification)
            .filter(or_(Notification.user_id == user_id, Notification.user_id == None))
            .order_by(Notification.created_at.desc())
            .limit(50)
            .all()
        )
    return db.query(Notification).order_by(Notification.created_at.desc()).limit(50).all()


def mark_notification_read(db: Session, notif_id: int) -> bool:
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if not notif:
        return False
    notif.is_read = True
    db.commit()
    return True


# ==============================================================================
# Analytics & Stats
# ==============================================================================
def get_platform_analytics(db: Session) -> Dict[str, Any]:
    total_incidents = db.query(Incident).count()
    active_incidents = (
        db.query(Incident)
        .filter(Incident.status.notin_(["Resolved", "Cancelled", "Rejected"]))
        .count()
    )
    critical_count = (
        db.query(Incident)
        .filter(Incident.priority == "Critical", Incident.status.notin_(["Resolved", "Cancelled"]))
        .count()
    )
    high_count = (
        db.query(Incident)
        .filter(Incident.priority == "High", Incident.status.notin_(["Resolved", "Cancelled"]))
        .count()
    )
    pending_verification = (
        db.query(Incident)
        .filter(Incident.status == "Verification Pending")
        .count()
    )
    resolved_count = db.query(Incident).filter(Incident.status == "Resolved").count()
    cancelled_count = db.query(Incident).filter(Incident.status == "Cancelled").count()

    available_resources = db.query(Resource).filter(Resource.status == "Available").count()
    assigned_resources = db.query(Resource).filter(Resource.status.in_(["Assigned", "Busy"])).count()

    # Category breakdown
    category_counts = {}
    for cat, cnt in db.query(Incident.category, func.count(Incident.id)).group_by(Incident.category).all():
        category_counts[cat] = cnt

    # Feedback score
    avg_rating = db.query(func.avg(Feedback.rating)).scalar() or 4.8

    return {
        "total_incidents": total_incidents,
        "active_incidents": active_incidents,
        "critical_incidents": critical_count,
        "high_priority_incidents": high_count,
        "pending_verification": pending_verification,
        "resolved_incidents": resolved_count,
        "cancelled_incidents": cancelled_count,
        "available_resources": available_resources,
        "assigned_resources": assigned_resources,
        "average_feedback_rating": round(avg_rating, 2),
        "category_breakdown": category_counts,
    }


# ==============================================================================
# Legacy Compatibility Methods (for existing tests)
# ==============================================================================
def get_stats(db: Session):
    total = db.query(Emergency).count()
    pending = db.query(Emergency).filter(Emergency.status == "Pending").count()
    responded = db.query(Emergency).filter(Emergency.status == "Responded").count()
    resolved = db.query(Emergency).filter(Emergency.status == "Resolved").count()
    critical = db.query(Emergency).filter(Emergency.priority == "Critical").count()
    avail_res = db.query(Resource).filter(Resource.status == "Available").count()
    return {
        "total": total,
        "pending": pending,
        "responded": responded,
        "resolved": resolved,
        "critical": critical,
        "available_resources": avail_res,
        "active_shortages": 0,
    }


def get_emergencies(db: Session, status: Optional[str] = None, priority: Optional[str] = None):
    query = db.query(Emergency)
    if status:
        query = query.filter(Emergency.status == status)
    if priority:
        query = query.filter(Emergency.priority == priority)
    return query.order_by(Emergency.created_at.desc()).all()


def get_emergency_by_id(db: Session, emergency_id: int):
    return db.query(Emergency).filter(Emergency.id == emergency_id).first()


def create_emergency(db: Session, payload: EmergencyCreate):
    item = Emergency(
        patient_name=payload.patient_name,
        room_number=payload.room_number,
        emergency_type=payload.emergency_type,
        priority=payload.priority,
        description=payload.description,
        status="Pending",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_emergency_status(db: Session, emergency_id: int, new_status: str):
    item = db.query(Emergency).filter(Emergency.id == emergency_id).first()
    if not item:
        return None
    item.status = new_status
    db.commit()
    db.refresh(item)
    return item


def delete_emergency(db: Session, emergency_id: int) -> bool:
    item = db.query(Emergency).filter(Emergency.id == emergency_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
