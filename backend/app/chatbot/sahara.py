import re
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import Incident, ChatbotLog

GREETING = "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a gentle breath. We'll figure out the next step together. How can I help you right now?"

OFFICIAL_EMERGENCY_DISCLAIMER = (
    "🚨 If anyone is in immediate life-threatening danger, please immediately dial official emergency services (112 or 108 in India). "
    "CareOn is a coordination prototype and decision-support tool, not a replacement for government emergency services."
)


def process_sahara_message(message: str, session_id: str, db: Session) -> Dict[str, Any]:
    """
    Empathetic, rule-based intent matching for Sahara emergency companion.
    Adheres strictly to medical safety boundaries.
    """
    clean_msg = message.strip().lower()
    intent = "general_inquiry"
    response_text = ""
    suggested_actions = []

    # Check for direct incident code query (e.g., CARE-2026-101 or #101)
    code_match = re.search(r"care-[\w-]+|\b\d{3,4}\b", clean_msg)
    if code_match and any(w in clean_msg for w in ["status", "track", "where", "update", "check", "care-"]):
        code = code_match.group(0).upper()
        if not code.startswith("CARE-"):
            code = f"CARE-2026-{code}"

        incident = db.query(Incident).filter(Incident.incident_code == code).first()
        if incident:
            intent = "track_incident"
            response_text = (
                f"I found your request **{incident.incident_code}**! ❤️\n\n"
                f"• **Current Status:** {incident.status}\n"
                f"• **Category:** {incident.category}\n"
                f"• **Location:** {incident.location_name}\n"
                f"• **Priority:** {incident.priority}\n\n"
            )
            if incident.status == "Team Dispatched":
                response_text += "A coordinated response team has been confirmed and dispatched by our coordinator. Please keep your phone reachable!"
            elif incident.status == "Awaiting User Consent":
                response_text += "An external provider is available with an estimated charge. Please open your tracking page to review and confirm consent."
            elif incident.status == "Verification Pending":
                response_text += "Our coordinator is reviewing the emergency details. You can enter your demo OTP to verify."
            else:
                response_text += "Our coordinator is actively monitoring this incident."

            suggested_actions = [
                {"label": f"Open Tracking for {incident.incident_code}", "action": "track", "code": incident.incident_code},
                {"label": "Report New Emergency", "action": "report"},
            ]

            _log_chat(db, session_id, message, response_text, intent)
            return {"reply": response_text, "intent": intent, "suggested_actions": suggested_actions}

    # Intent 1: Direct life danger / medical advice query
    if any(w in clean_msg for w in [
        "heart attack", "chest pain", "unconscious", "not breathing", "dying", "severe bleeding",
        "stroke", "choking", "medicine should i take", "diagnose", "is this broken"
    ]):
        intent = "medical_triage_safety"
        response_text = (
            f"Please keep calm. ❤️ I cannot provide medical diagnoses or prescribe medication as I am an AI companion. \n\n"
            f"{OFFICIAL_EMERGENCY_DISCLAIMER}\n\n"
            f"If you are safe to do so, click **'Request Emergency Help'** below to broadcast your coordinates to our coordinator network."
        )
        suggested_actions = [
            {"label": "Request Emergency Help Now", "action": "report"},
            {"label": "Call 112 (Official Emergency)", "action": "call_112"},
        ]

    # Intent 2: How CareOn works
    elif any(w in clean_msg for w in ["what is careon", "how does careon work", "how it works", "about careon"]):
        intent = "about_careon"
        response_text = (
            "CareOn is an **Intelligent Emergency Resource Coordination Platform**.\n\n"
            "When multiple emergencies happen simultaneously, finding the closest and most suitable specialist resource "
            "(ambulances, rescue teams, fire crews, or NGOs) is difficult. CareOn helps coordinators match resources, "
            "prevents duplicate assignments, and coordinates registered external partners when local resources are occupied.\n\n"
            "Remember: We are a coordination support tool, working alongside official emergency numbers."
        )
        suggested_actions = [
            {"label": "Report Emergency", "action": "report"},
            {"label": "Track a Request", "action": "track_prompt"},
        ]

    # Intent 3: Reporting assistance
    elif any(w in clean_msg for w in ["report", "need help", "sos", "ambulance", "fire", "accident", "emergency"]):
        intent = "report_guidance"
        response_text = (
            "I'm right here with you. ❤️ To report an emergency:\n\n"
            "1. Click the **'Request Emergency Help'** button.\n"
            "2. Choose the emergency category (Medical, Road accident, Fire, Rescue, Disaster).\n"
            "3. Share your approximate location (or tap 'Use My Location').\n"
            "4. Enter a contact number so coordinators can reach you.\n\n"
            "It only takes 30 seconds, and no payment is ever required to request help."
        )
        suggested_actions = [
            {"label": "Open Emergency Form", "action": "report"},
            {"label": "What are the Categories?", "action": "categories_faq"},
        ]

    # Intent 4: Categories FAQ
    elif any(w in clean_msg for w in ["category", "categories", "what categories"]):
        intent = "categories_faq"
        response_text = (
            "CareOn coordinates six key emergency categories:\n\n"
            "• **Medical:** Acute illness, heart, breathing, unconsciousness, trauma.\n"
            "• **Road Accident:** Two-wheeler/vehicle crashes, trapped passengers.\n"
            "• **Fire:** Structural fires, gas leaks, electrical fires.\n"
            "• **Rescue:** Trapped individuals, structural or water rescue.\n"
            "• **Disaster:** Floods, mass casualties, relief supplies.\n"
            "• **Safety / Other:** Crowd distress, first-aid support."
        )
        suggested_actions = [{"label": "Report Emergency", "action": "report"}]

    # Intent 5: Tracking help
    elif any(w in clean_msg for w in ["track", "status", "where is help", "follow up"]):
        intent = "tracking_guide"
        response_text = (
            "You can track any active emergency using your unique incident code (for example: `CARE-2026-101`).\n\n"
            "Enter your code in the **'Track Request'** tab, or tell me your code right here and I'll look it up for you!"
        )
        suggested_actions = [
            {"label": "Go to Tracking Page", "action": "track_prompt"},
            {"label": "Check CARE-2026-101", "action": "track_code_demo"},
        ]

    # Intent 6: Cost, fees and consent
    elif any(w in clean_msg for w in ["cost", "charge", "fee", "free", "price", "pay", "money"]):
        intent = "cost_transparency"
        response_text = (
            "**CareOn platform fee is always ₹0.** We never charge people for requesting emergency help.\n\n"
            "If platform resources are unavailable and an external private provider is needed, our coordinator will clearly "
            "present the provider's quote and **ask for your consent first**. We never surprise-bill you, and free NGO/public "
            "options are prioritized whenever possible."
        )
        suggested_actions = [{"label": "Learn More About Safety", "action": "safety_info"}]

    # Intent 7: Cancellation
    elif any(w in clean_msg for w in ["cancel", "stop request", "cancellation"]):
        intent = "cancellation_guide"
        response_text = (
            "If your emergency has been resolved or help was arranged independently, you can cancel your request from the **Track Request** page at any time.\n\n"
            "Simply click **'Cancel Request'**, select a quick reason, and our coordinator will safely release the assigned resources for others in need."
        )
        suggested_actions = [{"label": "Open Tracking", "action": "track_prompt"}]

    # Intent 8: Greeting / Friendly hello
    elif any(w in clean_msg for w in ["hello", "hi", "hey", "namaste", "good morning", "good evening"]):
        intent = "greeting"
        response_text = GREETING
        suggested_actions = [
            {"label": "Request Emergency Help", "action": "report"},
            {"label": "Track My Request", "action": "track_prompt"},
            {"label": "How CareOn Works", "action": "how_it_works"},
        ]

    # Fallback
    else:
        intent = "fallback"
        response_text = (
            "I want to make sure you get the right support. ❤️\n\n"
            "• If this is an urgent emergency, tap **'Request Emergency Help'**.\n"
            "• To check an existing incident, tell me your incident code (like `CARE-2026-101`).\n"
            "• Or speak directly with our command coordinator at **+91 80 2233 4455**."
        )
        suggested_actions = [
            {"label": "Request Emergency Help", "action": "report"},
            {"label": "Track Request", "action": "track_prompt"},
        ]

    _log_chat(db, session_id, message, response_text, intent)
    return {
        "reply": response_text,
        "intent": intent,
        "suggested_actions": suggested_actions,
    }


def _log_chat(db: Session, session_id: str, user_msg: str, bot_resp: str, intent: str):
    try:
        log = ChatbotLog(
            session_id=session_id[:64],
            user_message=user_msg[:500],
            bot_response=bot_resp[:1000],
            intent_detected=intent[:60],
        )
        db.add(log)
        db.commit()
    except Exception:
        db.rollback()
