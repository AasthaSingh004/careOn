from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


PriorityType = Literal["Critical", "High", "Medium", "Low"]
StatusType = Literal["Pending", "Responded", "Resolved"]
EmergencyCategory = Literal["Cardiac", "Respiratory", "Trauma", "Neurological", "General"]


class EmergencyBase(BaseModel):
    patient_name: str = Field(..., min_length=2, max_length=100, description="Full name of patient")
    room_number: str = Field(..., min_length=1, max_length=50, description="Hospital room / ward ID")
    emergency_type: EmergencyCategory = Field(default="General", description="Category of medical emergency")
    priority: PriorityType = Field(default="High", description="Triage priority level")
    description: Optional[str] = Field(default=None, max_length=1000, description="Additional medical observations")


class EmergencyCreate(EmergencyBase):
    pass


class EmergencyUpdateStatus(BaseModel):
    status: StatusType = Field(..., description="Updated response status")


class EmergencyResponse(EmergencyBase):
    id: int
    status: StatusType
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StatsResponse(BaseModel):
    total: int
    pending: int
    responded: int
    resolved: int
    critical: int


class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: str
    version: str
