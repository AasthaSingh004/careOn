from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Emergency
from app.schemas import EmergencyCreate


def get_emergencies(
    db: Session, status: Optional[str] = None, priority: Optional[str] = None
) -> List[Emergency]:
    query = db.query(Emergency)
    if status:
        query = query.filter(Emergency.status == status)
    if priority:
        query = query.filter(Emergency.priority == priority)
    return query.order_by(Emergency.created_at.desc()).all()


def get_emergency_by_id(db: Session, emergency_id: int) -> Optional[Emergency]:
    return db.query(Emergency).filter(Emergency.id == emergency_id).first()


def create_emergency(db: Session, emergency_in: EmergencyCreate) -> Emergency:
    db_item = Emergency(
        patient_name=emergency_in.patient_name.strip(),
        room_number=emergency_in.room_number.strip(),
        emergency_type=emergency_in.emergency_type,
        priority=emergency_in.priority,
        description=emergency_in.description.strip() if emergency_in.description else None,
        status="Pending",
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_emergency_status(db: Session, emergency_id: int, new_status: str) -> Optional[Emergency]:
    db_item = get_emergency_by_id(db, emergency_id)
    if not db_item:
        return None
    db_item.status = new_status
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_emergency(db: Session, emergency_id: int) -> bool:
    db_item = get_emergency_by_id(db, emergency_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True


def get_stats(db: Session) -> dict:
    total = db.query(Emergency).count()
    pending = db.query(Emergency).filter(Emergency.status == "Pending").count()
    responded = db.query(Emergency).filter(Emergency.status == "Responded").count()
    resolved = db.query(Emergency).filter(Emergency.status == "Resolved").count()
    critical = db.query(Emergency).filter(Emergency.priority == "Critical").count()

    return {
        "total": total,
        "pending": pending,
        "responded": responded,
        "resolved": resolved,
        "critical": critical,
    }


def seed_demo_data(db: Session):
    """Seed initial sample records if the database is currently empty."""
    if db.query(Emergency).count() == 0:
        samples = [
            Emergency(
                patient_name="Eleanor Vance",
                room_number="ICU-102",
                emergency_type="Cardiac",
                priority="Critical",
                status="Pending",
                description="Sudden arrhythmia observed on telemetry monitor. Immediate physician review needed.",
            ),
            Emergency(
                patient_name="Arthur Pendelton",
                room_number="Ward-3B",
                emergency_type="Respiratory",
                priority="High",
                status="Responded",
                description="Oxygen saturation dropped to 88%. Respiratory therapist dispatched.",
            ),
            Emergency(
                patient_name="Maya Lin",
                room_number="ER-Bay-4",
                emergency_type="Trauma",
                priority="Critical",
                status="Resolved",
                description="Severe fall injury, stabilized and transferred to radiology.",
            ),
        ]
        db.add_all(samples)
        db.commit()
