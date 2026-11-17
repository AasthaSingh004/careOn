import re
from typing import Tuple

CRITICAL_KEYWORDS = [
    "cardiac", "heart attack", "unconscious", "not breathing", "severe bleeding",
    "heavy bleeding", "explosion", "trapped in fire", "severe burn", "head trauma",
    "crushed", "drowning", "massive casualties", "building collapse"
]

HIGH_KEYWORDS = [
    "fracture", "deep cut", "collision", "two-wheeler accident", "highway accident",
    "kitchen fire", "gas leak", "smoke inhalation", "asthma attack", "seizure",
    "injured passenger", "waterlogging", "flood trapped"
]


def classify_incident(
    category: str,
    affected_people: int,
    help_required: str,
    description: str,
) -> Tuple[str, str]:
    """
    Rule-based, explainable classification of emergency incidents.
    Returns: (priority: str, reason: str)
    Priority is one of: Critical, High, Medium, Low
    """
    text_content = f"{category} {help_required} {description}".lower()

    # Rule 1: Life-threatening keywords
    matched_critical = [kw for kw in CRITICAL_KEYWORDS if re.search(r"\b" + re.escape(kw) + r"\b", text_content)]
    if matched_critical:
        return (
            "Critical",
            f"Critical priority: Emergency indicates life-threatening situation ({', '.join(matched_critical)})."
        )

    # Rule 2: Disaster with multiple people
    if category.startswith("Disaster") or affected_people >= 4:
        return (
            "Critical" if affected_people >= 5 else "High",
            f"Elevated priority: Multiple casualties reported ({affected_people} affected) requiring multi-team dispatch."
        )

    # Rule 3: Fire emergencies
    if category.lower() == "fire":
        if affected_people > 1 or "building" in text_content or "spread" in text_content:
            return ("Critical", "Critical priority: Fire emergency with active threat to life/structure.")
        return ("High", "High priority: Active fire incident requiring immediate containment.")

    # Rule 4: High severity keywords
    matched_high = [kw for kw in HIGH_KEYWORDS if re.search(r"\b" + re.escape(kw) + r"\b", text_content)]
    if matched_high:
        return (
            "High",
            f"High priority: Significant urgency identified ({', '.join(matched_high)})."
        )

    # Rule 5: Medical / Road accident defaults
    if category.lower() in ["medical", "road accident", "rescue"]:
        if affected_people > 1:
            return ("High", f"High priority: {category} emergency involving {affected_people} individuals.")
        return ("High", f"High priority: Acute {category.lower()} response requested.")

    # Rule 6: Minor / Safety / General
    if affected_people <= 1 and any(w in text_content for w in ["minor", "stable", "first aid", "advice", "inquiry"]):
        return ("Low", "Low priority: Stable situation without acute distress signals.")

    return ("Medium", "Medium priority: Standard emergency triage pending coordinator assessment.")
