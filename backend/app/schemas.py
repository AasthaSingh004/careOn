from datetime import datetime, timezone
from typing import List, Optional, Any, Dict, Annotated
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, PlainSerializer


def ensure_utc_datetime(v: Any) -> datetime:
    if isinstance(v, str):
        v = datetime.fromisoformat(v.replace("Z", "+00:00"))
    if isinstance(v, datetime):
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        else:
            v = v.astimezone(timezone.utc)
    return v


UTCDateTime = Annotated[
    datetime,
    BeforeValidator(ensure_utc_datetime),
    PlainSerializer(lambda v: v.isoformat().replace("+00:00", "Z"), return_type=str, when_used="json"),
]


# ==============================================================================
# Auth Schemas
# ==============================================================================
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    phone: str = Field(..., min_length=8, max_length=20)
    password: str = Field(..., min_length=6)
    confirm_password: Optional[str] = None
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    role: str
    trust_score: str
    is_flagged: bool
    created_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserResponse


# ==============================================================================
# Incident Schemas
# ==============================================================================
class IncidentCreate(BaseModel):
    category: str = Field(..., description="Medical, Road accident, Fire, Rescue, Safety / Other, Disaster / Multiple affected people")
    description: str = Field(..., min_length=5)
    location_name: str = Field(..., min_length=2)
    latitude: Optional[float] = 12.3052
    longitude: Optional[float] = 76.6552
    affected_people: Optional[int] = 1
    help_required: str = Field(..., min_length=2)
    contact_name: str = Field(..., min_length=2)
    contact_phone: str = Field(..., min_length=8)
    additional_details: Optional[str] = None
    is_disaster: Optional[bool] = False
    disaster_details: Optional[str] = None


class IncidentVerify(BaseModel):
    otp: str = Field(..., min_length=4, max_length=8)


class IncidentStatusUpdate(BaseModel):
    status: str
    message: Optional[str] = None
    internal_admin_notes: Optional[str] = None


class IncidentPriorityUpdate(BaseModel):
    priority: str
    reason: str


class IncidentCancel(BaseModel):
    reason: str = Field(..., description="Emergency resolved, Help arranged independently, Request submitted by mistake, Other")
    details: Optional[str] = None


class IncidentUpdateItem(BaseModel):
    id: int
    status: str
    message: str
    actor: str
    is_public: bool
    created_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class ResourceSimple(BaseModel):
    id: int
    resource_code: str
    name: str
    category: str
    contact_phone: str
    status: str
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)


class AssignmentResponse(BaseModel):
    id: int
    incident_id: int
    resource_id: int
    assigned_by: str
    status: str
    assigned_at: UTCDateTime
    released_at: Optional[UTCDateTime] = None
    notes: Optional[str] = None
    resource: Optional[ResourceSimple] = None

    model_config = ConfigDict(from_attributes=True)


class ProviderEnquiryResponse(BaseModel):
    id: int
    incident_id: int
    provider_id: int
    status: str
    charge_quote: float
    careon_fee: float
    subsidy_amount: float
    user_consent: str
    response_time_minutes: int
    notes: Optional[str] = None
    provider_name: Optional[str] = None
    created_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class FeedbackResponse(BaseModel):
    id: int
    rating: int
    tags: Optional[str] = None
    comments: Optional[str] = None
    created_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class IncidentResponse(BaseModel):
    id: int
    incident_code: str
    user_id: Optional[int] = None
    category: str
    title: str
    description: str
    location_name: str
    latitude: float
    longitude: float
    affected_people: int
    help_required: str
    contact_name: str
    contact_phone: str
    additional_details: Optional[str] = None
    priority: str
    priority_reason: Optional[str] = None
    status: str
    is_verified: bool
    is_duplicate: bool
    is_disaster: bool
    disaster_details: Optional[str] = None
    internal_admin_notes: Optional[str] = None
    created_at: UTCDateTime
    updated_at: Optional[UTCDateTime] = None

    model_config = ConfigDict(from_attributes=True)


class IncidentCreateResponse(IncidentResponse):
    simulated_otp: Optional[str] = Field(
        default=None,
        description="Simulated in-app verification code returned only to the authenticated reporter in the immediate creation/verification flow."
    )


class RequestOTPResponse(BaseModel):
    incident_id: int
    incident_code: str
    simulated_otp: str
    expires_at: UTCDateTime
    message: str = "Simulated in-app emergency verification code generated."


class DoctorCallbackCreate(BaseModel):
    chief_complaint: Optional[str] = Field(None, max_length=1000)
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None


class DoctorCallbackUpdateStatus(BaseModel):
    status: str = Field(..., pattern="^(Pending|In Review|Contacted|Closed|Declined)$")
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None


class DoctorCallbackResponse(BaseModel):
    id: int
    incident_id: int
    incident_code: Optional[str] = None
    user_id: int
    contact_name: str
    contact_phone: Optional[str] = None
    chief_complaint: Optional[str] = None
    status: str
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: UTCDateTime
    updated_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class IncidentDetailResponse(IncidentResponse):
    updates: List[IncidentUpdateItem] = []
    assignments: List[AssignmentResponse] = []
    provider_enquiries: List[ProviderEnquiryResponse] = []
    feedback: Optional[FeedbackResponse] = None
    doctor_callback_requests: List[DoctorCallbackResponse] = []


# ==============================================================================
# Resource Schemas
# ==============================================================================
class ResourceCreate(BaseModel):
    resource_code: str
    name: str
    category: str
    capabilities: str
    location_name: str
    latitude: float = 12.3052
    longitude: float = 76.6552
    status: Optional[str] = "Available"
    capacity: Optional[int] = 1
    contact_phone: str


class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    capabilities: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    contact_phone: Optional[str] = None


class ResourceResponse(BaseModel):
    id: int
    resource_code: str
    name: str
    category: str
    capabilities: str
    location_name: str
    latitude: float
    longitude: float
    status: str
    capacity: int
    contact_phone: str
    current_assignment_id: Optional[int] = None
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Allocation Schemas
# ==============================================================================
class AllocationRecommendRequest(BaseModel):
    incident_id: int


class AllocationConfirmRequest(BaseModel):
    incident_id: int
    resource_id: int
    notes: Optional[str] = None


# ==============================================================================
# Provider Schemas
# ==============================================================================
class ProviderCreate(BaseModel):
    name: str
    provider_type: str
    is_registered_partner: bool = True
    location_name: str
    latitude: float = 12.3052
    longitude: float = 76.6552
    contact_person: str
    phone: str
    service_capabilities: str
    estimated_base_charge: float = 0.0


class ProviderResponse(BaseModel):
    id: int
    name: str
    provider_type: str
    is_registered_partner: bool
    location_name: str
    latitude: float
    longitude: float
    contact_person: str
    phone: str
    service_capabilities: str
    estimated_base_charge: float
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class ProviderEnquiryCreate(BaseModel):
    incident_id: int
    provider_id: int
    status: Optional[str] = "Contacted"
    charge_quote: Optional[float] = 0.0
    subsidy_amount: Optional[float] = 0.0
    user_consent: Optional[str] = "Pending"
    response_time_minutes: Optional[int] = 15
    notes: Optional[str] = None


class ProviderEnquiryUpdate(BaseModel):
    status: Optional[str] = None
    charge_quote: Optional[float] = None
    user_consent: Optional[str] = None
    notes: Optional[str] = None


# ==============================================================================
# Notifications & Feedback
# ==============================================================================
class NotificationResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    incident_id: Optional[int] = None
    title: str
    message: str
    type: str
    target_role: Optional[str] = "user"
    action_url: Optional[str] = None
    is_read: bool
    created_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class FeedbackCreate(BaseModel):
    incident_id: int
    rating: int = Field(..., ge=1, le=5)
    tags: Optional[str] = None
    comments: Optional[str] = None


# ==============================================================================
# Chatbot & System Configuration
# ==============================================================================
class ChatbotMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"
    user_name: Optional[str] = None
    lang: Optional[str] = "en"


class ChatbotMessageResponse(BaseModel):
    reply: str
    intent: str
    suggested_actions: List[Dict[str, Any]] = []


class SystemConfigResponse(BaseModel):
    official_emergency_number: str = "112"
    official_emergency_disclaimer: str = (
        "CareOn is an emergency coordination decision-support tool, not a replacement for government emergency services (112 / 108)."
    )


class SimulationRunRequest(BaseModel):
    scenario: Optional[str] = "resource_shortage_challenge"


# ==============================================================================
# Backward Compatibility for existing tests
# ==============================================================================
class EmergencyCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=100)
    room_number: str = Field(..., min_length=1, max_length=50)
    emergency_type: str = Field(..., min_length=1, max_length=50)
    priority: str = Field(default="High", pattern="^(Critical|High|Medium|Low)$")
    description: Optional[str] = Field(default=None, max_length=500)


class EmergencyUpdateStatus(BaseModel):
    status: str = Field(..., pattern="^(Pending|Responded|Resolved)$")


class EmergencyResponse(BaseModel):
    id: int
    patient_name: str
    room_number: str
    emergency_type: str
    priority: str
    status: str
    description: Optional[str] = None
    created_at: UTCDateTime
    updated_at: UTCDateTime

    model_config = ConfigDict(from_attributes=True)


class StatsResponse(BaseModel):
    total: int
    pending: int
    responded: int
    resolved: int
    critical: int
    available_resources: Optional[int] = 0
    active_shortages: Optional[int] = 0


class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: str
    version: str
