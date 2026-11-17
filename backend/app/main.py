from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app import __version__
from app.database import engine, Base, get_db
from app.models import Emergency  # noqa: F401
from app.schemas import (
    EmergencyCreate,
    EmergencyUpdateStatus,
    EmergencyResponse,
    StatsResponse,
    HealthResponse,
)
from app import crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed default demo data if empty
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        crud.seed_demo_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="CareOn Emergency Response API",
    description="Backend microservice for hospital emergency dispatch, triage, and real-time tracking.",
    version=__version__,
    lifespan=lifespan,
)

# CORS setup for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["System"])
def root():
    return {
        "service": "CareOn Emergency Dispatch API",
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


@app.get("/api/stats", response_model=StatsResponse, tags=["Analytics"])
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Aggregate statistics for emergencies."""
    return crud.get_stats(db)


@app.get("/api/emergencies", response_model=List[EmergencyResponse], tags=["Emergencies"])
def list_emergencies(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    db: Session = Depends(get_db),
):
    """Retrieve all emergencies with optional status or priority filtering."""
    return crud.get_emergencies(db, status=status_filter, priority=priority_filter)


@app.get("/api/emergencies/{emergency_id}", response_model=EmergencyResponse, tags=["Emergencies"])
def get_emergency(emergency_id: int, db: Session = Depends(get_db)):
    """Retrieve details of a specific emergency record."""
    item = crud.get_emergency_by_id(db, emergency_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return item


@app.post(
    "/api/emergencies",
    response_model=EmergencyResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Emergencies"],
)
def create_emergency(payload: EmergencyCreate, db: Session = Depends(get_db)):
    """Dispatch a new emergency alert."""
    return crud.create_emergency(db, payload)


@app.patch(
    "/api/emergencies/{emergency_id}/status",
    response_model=EmergencyResponse,
    tags=["Emergencies"],
)
def update_status(
    emergency_id: int, payload: EmergencyUpdateStatus, db: Session = Depends(get_db)
):
    """Update the response status of an emergency (Pending -> Responded -> Resolved)."""
    updated = crud.update_emergency_status(db, emergency_id, payload.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return updated


@app.delete(
    "/api/emergencies/{emergency_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Emergencies"],
)
def delete_emergency(emergency_id: int, db: Session = Depends(get_db)):
    """Remove an emergency record."""
    success = crud.delete_emergency(db, emergency_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency with ID {emergency_id} not found.",
        )
    return None
