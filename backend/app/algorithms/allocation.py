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

        # Multi-factor explainable scoring:
        # 1. Proximity score (0 to 1, higher is closer)
        norm_dist = max(0.0, 1.0 - (distance / 20.0))

        # 2. Capability match score (0 to 1)
        preferred = CATEGORY_PREFERRED_RESOURCES.get(incident.category, [])
        if res.category in preferred:
            rank = preferred.index(res.category)
            cap_score = max(0.5, 1.0 - (rank * 0.15))
        else:
            cap_score = 0.70

        # 3. Fleet buffer: remaining matching resources
        buffer_count = len([
            r for r in available_resources
            if r.id != res.id and r.status == "Available" and resource_matches_incident(r, incident)
        ])
        buffer_score = min(1.0, buffer_count / 3.0)

        # Weighted confidence score (0.0 to 1.0)
        confidence = round(0.40 * norm_dist + 0.35 * cap_score + 0.25 * buffer_score, 2)

        # Legacy score sorting (lower is better for rank sorting)
        sort_score = distance * 2.0 + ((1.0 - cap_score) * 10.0)

        candidates.append({
            "resource": res,
            "distance_km": distance,
            "eta_minutes": eta,
            "score": sort_score,
            "confidence_score": confidence,
            "buffer_count": buffer_count,
            "norm_dist": norm_dist,
            "cap_score": cap_score,
        })

    if candidates:
        candidates.sort(key=lambda c: c["score"])
        best = candidates[0]
        res = best["resource"]
        conf = best["confidence_score"]
        buffer_count = best["buffer_count"]

        # Safe auto-dispatch rule: routine priority, high confidence, safe fleet buffer
        is_routine = incident.priority in ["Low", "Medium"]
        is_safe_auto_dispatch = (conf >= 0.85) and is_routine and (buffer_count >= 2)

        reasons = []
        if incident.priority in ["Critical", "High"]:
            reasons.append(f"{incident.priority} severity mandates coordinator oversight")
        if buffer_count < 2:
            reasons.append(f"narrow fleet reserve ({buffer_count} units left)")
        if best["distance_km"] > 8.0:
            reasons.append(f"non-optimal proximity ({best['distance_km']} km)")
        if conf < 0.85:
            reasons.append(f"confidence score ({int(conf * 100)}%) is below automated threshold")

        decision_reason = (
            f"Routine safe dispatch: nearest unit with matching capabilities and safe fleet buffer ({buffer_count} units)."
            if is_safe_auto_dispatch
            else f"Coordinator review required: {', '.join(reasons) if reasons else 'Manual confirmation required'}."
        )

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
            "confidence_score": conf,
            "confidence_percent": int(conf * 100),
            "fleet_buffer": buffer_count,
            "auto_dispatch_recommended": is_safe_auto_dispatch,
            "requires_admin_approval": not is_safe_auto_dispatch,
            "algorithm_type": "Explainable Multi-Factor Scoring (Rule-Based Heuristic)",
            "decision_reason": decision_reason,
            "factors": {
                "distance_km": best["distance_km"],
                "capability_rating": round(best["cap_score"], 2),
                "fleet_buffer_units": buffer_count,
            },
            "explanation": (
                f"Recommended: {res.name} ({res.category}) — available, matching required capabilities, "
                f"located {best['distance_km']} km away with estimated ETA ~{best['eta_minutes']} mins. "
                f"Confidence: {int(conf * 100)}%. {decision_reason}"
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
        "confidence_score": 0.0,
        "confidence_percent": 0,
        "fleet_buffer": 0,
        "auto_dispatch_recommended": False,
        "requires_admin_approval": True,
        "algorithm_type": "Explainable Multi-Factor Scoring (Rule-Based Heuristic)",
        "decision_reason": "Shortage detected: no active government resources available matching requirements.",
        "factors": {
            "distance_km": None,
            "capability_rating": 0.0,
            "fleet_buffer_units": 0,
        },
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
