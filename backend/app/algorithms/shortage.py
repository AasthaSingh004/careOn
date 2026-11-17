from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Incident, Resource, ExternalProvider, Assignment
from app.algorithms.allocation import CATEGORY_PREFERRED_RESOURCES


def get_current_shortages(db: Session) -> Dict[str, Any]:
    """
    Analyze all active incidents that do not have an active assignment.
    Identify resource deficits and suggested external providers.
    """
    active_incidents = (
        db.query(Incident)
        .filter(
            Incident.status.in_([
                "Received",
                "Verification Pending",
                "Verified",
                "Assistance Search",
                "Provider Contacted",
                "Awaiting Provider Response",
                "Awaiting User Consent",
            ])
        )
        .all()
    )

    # Active assigned incident IDs
    assigned_incidents = {
        a.incident_id
        for a in db.query(Assignment).filter(Assignment.status == "Active").all()
    }

    # Available resources count by category
    available_counts = {}
    for res in db.query(Resource).filter(Resource.status == "Available").all():
        available_counts[res.category] = available_counts.get(res.category, 0) + 1

    shortage_items = []
    registered_partners = (
        db.query(ExternalProvider)
        .filter(ExternalProvider.is_registered_partner == True, ExternalProvider.is_active == True)
        .all()
    )

    for inc in active_incidents:
        if inc.id in assigned_incidents:
            continue

        needed_categories = CATEGORY_PREFERRED_RESOURCES.get(inc.category, ["Emergency Unit"])
        has_local_res = any(available_counts.get(cat, 0) > 0 for cat in needed_categories)

        if not has_local_res:
            # Suggest matching external partner
            suggested_partner = None
            for p in registered_partners:
                if any(cat.lower() in p.provider_type.lower() or cat.lower() in p.service_capabilities.lower() for cat in needed_categories):
                    suggested_partner = p
                    break
            if not suggested_partner and registered_partners:
                suggested_partner = registered_partners[0]

            shortage_items.append({
                "incident_id": inc.id,
                "incident_code": inc.incident_code,
                "category": inc.category,
                "priority": inc.priority,
                "location": inc.location_name,
                "missing_resource_type": ", ".join(needed_categories),
                "available_in_fleet": {cat: available_counts.get(cat, 0) for cat in needed_categories},
                "suggested_provider": {
                    "id": suggested_partner.id if suggested_partner else None,
                    "name": suggested_partner.name if suggested_partner else "CityCare Partner Network",
                    "type": suggested_partner.provider_type if suggested_partner else "Hospital/Ambulance",
                    "phone": suggested_partner.phone if suggested_partner else "108 / 112",
                    "estimated_charge": suggested_partner.estimated_base_charge if suggested_partner else 0.0,
                } if suggested_partner else None,
                "action": "Enquire with registered external provider and record availability.",
            })

    return {
        "total_active_unassigned": len(active_incidents) - len(assigned_incidents),
        "shortage_count": len(shortage_items),
        "shortages": shortage_items,
        "available_fleet_summary": available_counts,
    }
