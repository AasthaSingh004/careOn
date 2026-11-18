from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import Incident, Resource

# Predefined urban demo zones with historical baseline weighting (Mysuru, Karnataka)
ZONES = [
    {"name": "Central Mysuru / KR Hospital & Palace Corridor", "baseline_demand": 1.4, "primary_risk": "Medical / Traffic"},
    {"name": "Kuvempunagar - Saraswathipuram Residential Zone", "baseline_demand": 1.2, "primary_risk": "Road Accidents"},
    {"name": "Gokulam - Vijayanagar Commercial Corridor", "baseline_demand": 1.1, "primary_risk": "Fire / Kitchen Hazards"},
    {"name": "Hebbal - Belagola Industrial Suburb", "baseline_demand": 1.5, "primary_risk": "Disaster / Urban Flood"},
    {"name": "Chamundi Hill & Nazarbad Enclave", "baseline_demand": 1.0, "primary_risk": "Trauma / Medical Support"},
]


def predict_resource_shortage_risk(db: Session, zone_name: str = None) -> List[Dict[str, Any]]:
    """
    Sample statistical / rule-based shortage risk predictor.
    Uses time-of-day peak multipliers, active incident load, and available fleet buffer.
    """
    now = datetime.now(timezone.utc)
    hour = now.hour

    # Time of day risk multiplier (peak hours: 8-11 and 17-21)
    if 8 <= hour <= 11 or 17 <= hour <= 21:
        time_factor = 1.35
        time_desc = "Peak urban commute hours (+35% incident surge probability)"
    elif 23 <= hour or hour <= 4:
        time_factor = 0.85
        time_desc = "Late night baseline hours (-15% volume, higher trauma severity)"
    else:
        time_factor = 1.0
        time_desc = "Standard daytime operating window"

    # Count current active incidents
    active_incidents = (
        db.query(Incident)
        .filter(Incident.status.notin_(["Resolved", "Cancelled", "Rejected"]))
        .all()
    )
    incident_count = len(active_incidents)

    # Count available ambulances
    available_ambulances = (
        db.query(Resource)
        .filter(Resource.category == "Ambulance", Resource.status == "Available")
        .count()
    )
    available_total = (
        db.query(Resource)
        .filter(Resource.status == "Available")
        .count()
    )

    results = []
    selected_zones = [z for z in ZONES if not zone_name or z["name"].lower() == zone_name.lower()]
    if not selected_zones:
        selected_zones = ZONES

    for zone in selected_zones:
        raw_score = (zone["baseline_demand"] * time_factor * (1.0 + (incident_count * 0.15))) / max(1, available_ambulances)

        if raw_score >= 1.8:
            risk_level = "High"
            resource_in_demand = "Ambulance (Advanced Life Support)"
            action = "Pre-stage standby ambulance or notify Mission Hospital Partner Network."
        elif raw_score >= 1.2:
            risk_level = "Moderate"
            resource_in_demand = "Paramedic First-Aid Team"
            action = "Monitor corridor response times and hold 1 ambulance in reserve."
        else:
            risk_level = "Low"
            resource_in_demand = "Standard Fleet Support"
            action = "Normal coverage sufficient."

        results.append({
            "zone": zone["name"],
            "predicted_shortage_risk": risk_level,
            "risk_score": round(raw_score, 2),
            "likely_resource_in_demand": resource_in_demand,
            "primary_incident_category": zone["primary_risk"],
            "time_window_context": time_desc,
            "active_incident_pressure": f"{incident_count} active platform incidents",
            "available_ambulance_buffer": f"{available_ambulances} ambulances available",
            "recommended_coordinator_action": action,
            "disclaimer": "Notice: Educational prototype predictive model based on weighted sample historical baseline data. Not an official municipal emergency forecast.",
        })

    return results
