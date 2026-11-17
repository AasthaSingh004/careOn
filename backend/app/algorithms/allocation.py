import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import Incident, Resource, Assignment, ExternalProvider


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0  # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def calculate_eta_minutes(distance_km: float, speed_kmh: float = 35.0, delay_factor: float = 1.25) -> int:
    """Calculate estimated arrival time with urban traffic delay factor."""
    if distance_km <= 0:
        return 2
    raw_hours = distance_km / speed_kmh
    estimated_mins = int(math.ceil(raw_hours * 60.0 * delay_factor))
    return max(3, estimated_mins)


# Capability mappings for incident categories
CATEGORY_CAPABILITIES = {
    "Medical": ["ALS", "BLS", "patient_transport", "critical_care", "trauma_care", "first_aid"],
    "Road accident": ["ALS", "BLS", "trauma_care", "heavy_rescue", "extrication", "patient_transport"],
    "Fire": ["fire_suppression", "water_tender", "smoke_rescue", "extinguisher"],
    "Rescue": ["heavy_rescue", "search_and_rescue", "structural_collapse", "trauma_care"],
    "Safety / Other": ["first_aid", "patrol", "crowd_safety"],
    "Disaster / Multiple affected people": [
        "disaster_relief", "food_water", "shelter", "triage", "mass_casualty", "patient_transport"
    ],
}

CATEGORY_PREFERRED_RESOURCES = {
    "Medical": ["Ambulance", "Medical Team", "First-Aid Team"],
    "Road accident": ["Ambulance", "Rescue Team", "Medical Team"],
    "Fire": ["Fire Response", "Rescue Team"],
    "Rescue": ["Rescue Team", "Fire Response"],
    "Safety / Other": ["First-Aid Team", "Medical Team"],
    "Disaster / Multiple affected people": ["Relief Vehicle", "Shelter / Relief Centre", "Medical Team", "Ambulance"],
}


def resource_matches_incident(resource: Resource, incident: Incident) -> bool:
    """Check if resource category and capabilities match the incident requirements."""
    preferred_categories = CATEGORY_PREFERRED_RESOURCES.get(incident.category, [])
    if resource.category in preferred_categories:
        return True

    # Also check capability tags
    res_caps = [c.strip().lower() for c in resource.capabilities.split(",") if c.strip()]
    needed_caps = [c.lower() for c in CATEGORY_CAPABILITIES.get(incident.category, [])]

    return any(cap in needed_caps for cap in res_caps)


def evaluate_allocation_for_incident(
    incident: Incident,
    available_resources: List[Resource],
    db: Session,
) -> Dict[str, Any]:
    """
    Find best matching available resource for a single incident.
    Respects conflict prevention:
    - Resource status must be 'Available'
    - Resource cannot have any active Assignment
    """
    candidates = []

    for res in available_resources:
        if res.status != "Available":
            continue

        # Double check no active assignment in DB
        active_assignment = (
            db.query(Assignment)
            .filter(Assignment.resource_id == res.id, Assignment.status == "Active")
            .first()
        )
        if active_assignment:
            continue

        if not resource_matches_incident(res, incident):
            continue

        distance = calculate_haversine_distance(
            incident.latitude, incident.longitude, res.latitude, res.longitude
        )
        eta = calculate_eta_minutes(distance)

        # Scoring: lower distance is better, category priority matching
        preferred = CATEGORY_PREFERRED_RESOURCES.get(incident.category, [])
        category_rank = preferred.index(res.category) if res.category in preferred else 99
        score = distance * 2.0 + (category_rank * 5.0)

        candidates.append({
            "resource": res,
            "distance_km": distance,
            "eta_minutes": eta,
            "score": score,
        })

    if candidates:
        candidates.sort(key=lambda c: c["score"])
        best = candidates[0]
        res = best["resource"]

        return {
            "has_allocation": True,
            "incident_id": incident.id,
            "incident_code": incident.incident_code,
            "resource_id": res.id,
            "resource_code": res.resource_code,
            "resource_name": res.name,
            "resource_category": res.category,
            "distance_km": best["distance_km"],
            "eta_minutes": best["eta_minutes"],
            "explanation": (
                f"Recommended: {res.name} ({res.category}) — available, matching required capabilities, "
                f"located {best['distance_km']} km away with estimated ETA ~{best['eta_minutes']} mins."
            ),
            "shortage": None,
        }

    # Shortage detected
    preferred_types = ", ".join(CATEGORY_PREFERRED_RESOURCES.get(incident.category, ["Emergency Unit"]))
    # Suggest fallback registered external provider
    fallback_providers = (
        db.query(ExternalProvider)
        .filter(ExternalProvider.is_active == True)
        .all()
    )
    provider_suggestion = (
        fallback_providers[0].name if fallback_providers else "Registered NGO / Private Partner"
    )

    return {
        "has_allocation": False,
        "incident_id": incident.id,
        "incident_code": incident.incident_code,
        "resource_id": None,
        "resource_code": None,
        "resource_name": None,
        "resource_category": None,
        "distance_km": None,
        "eta_minutes": None,
        "explanation": f"Shortage Alert: No available {preferred_types} in active fleet for {incident.category}.",
        "shortage": {
            "missing_type": preferred_types,
            "incident_code": incident.incident_code,
            "recommended_action": f"Coordinate external assistance with registered partner: {provider_suggestion}.",
        },
    }


def compute_multi_incident_allocations(
    incidents: List[Incident],
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Global smart allocator for multiple simultaneous incidents:
    - Sorts incidents by priority: Critical (0), High (1), Medium (2), Low (3)
    - Allocates resources greedily to maximize coverage and minimize conflicts
    - Guaranteed conflict prevention: assigned resources are marked taken immediately
    """
    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    sorted_incidents = sorted(
        incidents,
        key=lambda inc: (priority_order.get(inc.priority, 9), inc.created_at)
    )

    # Get all active assignments to exclude
    active_assignments = (
        db.query(Assignment.resource_id)
        .filter(Assignment.status == "Active")
        .all()
    )
    active_res_ids = {a[0] for a in active_assignments}

    # Fetch available resources
    all_available = (
        db.query(Resource)
        .filter(Resource.status == "Available", ~Resource.id.in_(active_res_ids))
        .all()
    )

    remaining_resources = list(all_available)
    results = []

    for inc in sorted_incidents:
        alloc = evaluate_allocation_for_incident(inc, remaining_resources, db)
        results.append(alloc)
        if alloc["has_allocation"]:
            # Remove this resource from remaining so it CANNOT be double assigned
            remaining_resources = [r for r in remaining_resources if r.id != alloc["resource_id"]]

    return results
