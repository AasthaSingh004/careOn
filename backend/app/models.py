from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base


class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(100), nullable=False)
    room_number = Column(String(50), nullable=False)
    emergency_type = Column(String(50), nullable=False)  # Cardiac, Respiratory, Trauma, Neurological, General
    priority = Column(String(20), nullable=False, default="High")  # Critical, High, Medium, Low
    status = Column(String(20), nullable=False, default="Pending")  # Pending, Responded, Resolved
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
