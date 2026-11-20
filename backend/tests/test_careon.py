import os
import pytest
from app.algorithms.classification import classify_incident
from app.algorithms.allocation import calculate_haversine_distance, calculate_eta_minutes


# ==============================================================================
# Auth & Access Control Tests
# ==============================================================================
def test_user_registration_and_login(client):
    # Register new user
    reg_payload = {
        "name": "Priya Sharma",
        "email": "priya.test@example.com",
        "phone": "+91 99887 76655",
        "password": "securepassword123",
        "role": "user",
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "priya.test@example.com"
    assert data["user"]["role"] == "user"

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": "priya.test@example.com",
        "password": "securepassword123",
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # Access /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Priya Sharma"


def test_admin_route_protection(client):
    # Register normal user
    res = client.post("/api/auth/register", json={
        "name": "Normal Citizen",
        "email": "citizen@example.com",
        "phone": "+91 91234 56789",
        "password": "userpass123",
    })
    token = res.json()["access_token"]

    # Attempt to call admin endpoint without token -> 401
    res_no_auth = client.get("/api/admin/analytics")
    assert res_no_auth.status_code == 401

    # Attempt to call admin endpoint with normal user token -> 403 Forbidden
    res_forbidden = client.get(
        "/api/admin/analytics",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_forbidden.status_code == 403

    # Login as seeded admin -> 200 OK
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]

    admin_res = client.get(
        "/api/admin/analytics",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_res.status_code == 200
    assert "active_incidents" in admin_res.json()


# ==============================================================================
# Incident Reporting, Classification & Duplicate Detection
# ==============================================================================
def test_incident_reporting_and_classification(client):
    payload = {
        "category": "Medical",
        "description": "Patient is having severe cardiac arrest and unconsciousness.",
        "location_name": "MG Road Cross",
        "latitude": 12.9750,
        "longitude": 77.6060,
        "affected_people": 1,
        "help_required": "ALS Ambulance & Defibrillator",
        "contact_name": "Test Reporter",
        "contact_phone": "+91 98765 00000",
    }
    res = client.post("/api/incidents", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["incident_code"].startswith("CARE-2026-")
    assert data["priority"] == "Critical"  # Cardiac keyword rule
    assert data["status"] == "Received"
    assert data["is_verified"] is False
    # OTP is not exposed in ordinary responses or to unauthenticated callers
    assert "verification_otp" not in data or data.get("verification_otp") is None
    assert "simulated_otp" not in data or data.get("simulated_otp") is None


def test_duplicate_incident_detection(client):
    # First report
    p1 = {
        "category": "Road accident",
        "description": "Two car collision at junction.",
        "location_name": "Koramangala 5th Block",
        "latitude": 12.9350,
        "longitude": 77.6250,
        "affected_people": 2,
        "help_required": "Ambulance",
        "contact_name": "Reporter One",
        "contact_phone": "+91 98888 11111",
    }
    res1 = client.post("/api/incidents", json=p1)
    assert res1.status_code == 201
    code1 = res1.json()["incident_code"]

    # Duplicate report: same category, location < 800m
    p2 = {
        "category": "Road accident",
        "description": "Accident between two cars blocking lane.",
        "location_name": "Koramangala 5th Block Signal",
        "latitude": 12.9352,
        "longitude": 77.6251,
        "affected_people": 2,
        "help_required": "Ambulance",
        "contact_name": "Reporter Two",
        "contact_phone": "+91 98888 22222",
    }
    res2 = client.post("/api/incidents", json=p2)
    assert res2.status_code == 201
    data2 = res2.json()
    assert data2["is_duplicate"] is True


def test_phone_verification_via_otp(client):
    # Register & login reporter
    reg_res = client.post("/api/auth/register", json={
        "name": "Pooja Hegde",
        "email": "pooja.verify@example.com",
        "phone": "+91 97777 66666",
        "password": "poojapassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create incident as authenticated reporter
    res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Patient breathing difficulty.",
        "location_name": "Jayanagar 4th T Block",
        "affected_people": 1,
        "help_required": "Oxygen",
        "contact_name": "Pooja Hegde",
        "contact_phone": "+91 97777 66666",
    }, headers=headers)
    assert res.status_code == 201
    create_data = res.json()
    inc_id = create_data["id"]
    simulated_otp = create_data.get("simulated_otp")

    # Verify simulated OTP is a 6-digit random code and not hardcoded defaults
    assert simulated_otp is not None
    assert len(simulated_otp) == 6
    assert simulated_otp.isdigit()
    assert simulated_otp not in ["123456", "000000"]

    # Verify with correct simulated OTP
    v_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
    assert v_res.status_code == 200
    assert v_res.json()["is_verified"] is True
    assert v_res.json()["status"] == "Verified"

    # Verify incident details do not expose OTP
    get_res = client.get(f"/api/incidents/{inc_id}", headers=headers)
    assert get_res.status_code == 200
    assert "verification_otp" not in get_res.json()
    assert "simulated_otp" not in get_res.json()


def test_otp_incorrect_rejection_and_five_attempt_limit(client):
    # Register reporter
    reg_res = client.post("/api/auth/register", json={
        "name": "Ravi Kumar",
        "email": "ravi.attempts@example.com",
        "phone": "+91 95555 11111",
        "password": "ravipassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create incident
    res = client.post("/api/incidents", json={
        "category": "Fire",
        "description": "Smoke in electrical panel.",
        "location_name": "Indiranagar",
        "help_required": "Fire response",
        "contact_name": "Ravi Kumar",
        "contact_phone": "+91 95555 11111",
    }, headers=headers)
    inc_id = res.json()["id"]

    # Attempt 1 to 4 with incorrect OTP
    for i in range(1, 5):
        bad_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": "000000"}, headers=headers)
        assert bad_res.status_code == 400
        assert f"Attempts remaining: {5 - i}" in bad_res.json()["detail"]

    # Attempt 5: locks account / exceeds limit
    bad_res_5 = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": "000000"}, headers=headers)
    assert bad_res_5.status_code == 400

    # Attempt 6: Rejected due to attempt limit exceeded
    locked_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": "000000"}, headers=headers)
    assert locked_res.status_code == 400
    assert "Maximum verification attempts exceeded" in locked_res.json()["detail"]


def test_otp_expiry(client, db_session):
    from datetime import datetime, timezone, timedelta
    from app.models import Incident

    reg_res = client.post("/api/auth/register", json={
        "name": "Kavita Rao",
        "email": "kavita.expiry@example.com",
        "phone": "+91 94444 22222",
        "password": "kavitapassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Acute asthma attack.",
        "location_name": "Whitefield",
        "help_required": "Inhaler and ambulance",
        "contact_name": "Kavita Rao",
        "contact_phone": "+91 94444 22222",
    }, headers=headers)
    inc_id = res.json()["id"]
    simulated_otp = res.json()["simulated_otp"]

    # Manually expire the OTP in database
    inc_obj = db_session.query(Incident).filter(Incident.id == inc_id).first()
    inc_obj.otp_expires_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    db_session.commit()

    # Attempt verify with correct OTP but expired timestamp
    exp_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
    assert exp_res.status_code == 400
    assert "expired" in exp_res.json()["detail"].lower()


def test_otp_reporter_ownership_restrictions(client):
    # Reporter A
    res_a = client.post("/api/auth/register", json={
        "name": "User Alpha",
        "email": "alpha.owner@example.com",
        "phone": "+91 91111 00001",
        "password": "alphapassword123",
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Reporter B
    res_b = client.post("/api/auth/register", json={
        "name": "User Beta",
        "email": "beta.owner@example.com",
        "phone": "+91 91111 00002",
        "password": "betapassword123",
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User A creates incident
    inc_res = client.post("/api/incidents", json={
        "category": "Road accident",
        "description": "Car hit guard rail.",
        "location_name": "Outer Ring Road",
        "help_required": "Ambulance",
        "contact_name": "User Alpha",
        "contact_phone": "+91 91111 00001",
    }, headers=headers_a)
    inc_id = inc_res.json()["id"]
    otp_a = inc_res.json()["simulated_otp"]

    # User B tries to verify User A's incident -> 403 Forbidden
    hack_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": otp_a}, headers=headers_b)
    assert hack_res.status_code == 403
    assert "Access denied: Only the incident reporter" in hack_res.json()["detail"]

    # Unauthenticated attempt -> 401 Unauthorized
    unauth_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": otp_a})
    assert unauth_res.status_code == 401


def test_otp_invalidation_after_successful_verification(client, db_session):
    from app.models import Incident

    # Register reporter
    reg_res = client.post("/api/auth/register", json={
        "name": "Suresh Raina",
        "email": "suresh.otp@example.com",
        "phone": "+91 92222 33333",
        "password": "sureshpassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create incident
    res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Patient collapse.",
        "location_name": "MG Road",
        "help_required": "Ambulance",
        "contact_name": "Suresh Raina",
        "contact_phone": "+91 92222 33333",
    }, headers=headers)
    inc_data = res.json()
    inc_id = inc_data["id"]
    simulated_otp = inc_data["simulated_otp"]

    # Verify initial DB state has otp_hash and otp_expires_at
    inc_obj = db_session.query(Incident).filter(Incident.id == inc_id).first()
    assert inc_obj.otp_hash is not None
    assert inc_obj.otp_expires_at is not None
    assert inc_obj.is_verified is False

    # Verify with correct OTP
    v_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
    assert v_res.status_code == 200
    assert v_res.json()["is_verified"] is True

    # Assert DB fields are invalidated/cleared
    db_session.expire_all()
    inc_updated = db_session.query(Incident).filter(Incident.id == inc_id).first()
    assert inc_updated.is_verified is True
    assert inc_updated.otp_hash is None
    assert inc_updated.otp_expires_at is None
    assert inc_updated.otp_attempts == 0


def test_otp_reuse_rejected(client):
    reg_res = client.post("/api/auth/register", json={
        "name": "Anil Kumble",
        "email": "anil.reuse@example.com",
        "phone": "+91 93333 11111",
        "password": "anilpassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Sports injury sprain.",
        "location_name": "Chinnaswamy Stadium",
        "help_required": "First Aid",
        "contact_name": "Anil Kumble",
        "contact_phone": "+91 93333 11111",
    }, headers=headers)
    inc_data = res.json()
    inc_id = inc_data["id"]
    simulated_otp = inc_data["simulated_otp"]

    # First verification succeeds
    v1 = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
    assert v1.status_code == 200
    assert v1.json()["is_verified"] is True

    # Second verification attempt with same OTP must be rejected with HTTP 400
    v2 = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
    assert v2.status_code == 400
    assert "already verified" in v2.json()["detail"].lower()


def test_concurrent_otp_failed_attempts():
    import tempfile, os
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from fastapi.testclient import TestClient
    from concurrent.futures import ThreadPoolExecutor
    from app.database import Base, get_db
    from app.main import app
    from app import crud

    temp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    temp_db.close()
    db_url = f"sqlite:///{temp_db.name}"

    engine = create_engine(db_url, connect_args={"timeout": 30, "check_same_thread": False})
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA journal_mode=WAL")
        conn.commit()

    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    s = Session()
    crud.seed_demo_data(s)
    s.close()

    def override_db():
        db = Session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    try:
        with TestClient(app) as test_client:
            reg_res = test_client.post("/api/auth/register", json={
                "name": "Concurrency Reporter",
                "email": "concurrent.tester@example.com",
                "phone": "+91 90000 88888",
                "password": "testerpass123",
            })
            token = reg_res.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            res = test_client.post("/api/incidents", json={
                "category": "Medical",
                "description": "High fever child emergency.",
                "location_name": "Rajajinagar",
                "help_required": "Paediatric ambulance",
                "contact_name": "Concurrency Reporter",
                "contact_phone": "+91 90000 88888",
            }, headers=headers)
            inc_data = res.json()
            inc_id = inc_data["id"]
            simulated_otp = inc_data["simulated_otp"]

            def send_bad_otp(code):
                return test_client.post(f"/api/incidents/{inc_id}/verify", json={"otp": code}, headers=headers)

            bad_codes = [f"{100000 + i}" for i in range(8)]
            with ThreadPoolExecutor(max_workers=4) as executor:
                responses = list(executor.map(send_bad_otp, bad_codes))

            for r in responses:
                assert r.status_code == 400

            error_details = [r.json()["detail"] for r in responses]
            assert any("Maximum verification attempts exceeded" in d for d in error_details)

            final_attempt = test_client.post(f"/api/incidents/{inc_id}/verify", json={"otp": simulated_otp}, headers=headers)
            assert final_attempt.status_code == 400
            assert "Maximum verification attempts exceeded" in final_attempt.json()["detail"]
    finally:
        app.dependency_overrides.clear()
        if os.path.exists(temp_db.name):
            os.unlink(temp_db.name)


def test_doctor_callback_creation_ownership_and_admin_triage(client):
    # Register Citizen
    c_res = client.post("/api/auth/register", json={
        "name": "Meera Patel",
        "email": "meera.doctor@example.com",
        "phone": "+91 93333 44444",
        "password": "meerapassword123",
    })
    user_token = c_res.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    # Admin login
    a_res = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"})
    admin_token = a_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Create medical incident
    inc_res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "High fever with breathing discomfort.",
        "location_name": "Malleshwaram",
        "help_required": "Medical advice and monitoring",
        "contact_name": "Meera Patel",
        "contact_phone": "+91 93333 44444",
    }, headers=user_headers)
    inc_id = inc_res.json()["id"]

    # Request doctor tele-triage callback
    cb_payload = {"chief_complaint": "Persistent 103F fever, slight breathlessness, need tele-triage advice."}
    cb_res = client.post(f"/api/incidents/{inc_id}/doctor-callback", json=cb_payload, headers=user_headers)
    assert cb_res.status_code == 201
    cb_data = cb_res.json()
    cb_id = cb_data["id"]
    assert cb_data["status"] == "Pending"
    assert cb_data["contact_name"] == "Meera Patel"

    # User views callback status
    get_cb = client.get(f"/api/incidents/{inc_id}/doctor-callback", headers=user_headers)
    assert get_cb.status_code == 200
    assert len(get_cb.json()) >= 1
    assert get_cb.json()[0]["status"] == "Pending"

    # Admin visibility
    admin_list = client.get("/api/admin/doctor-callbacks", headers=admin_headers)
    assert admin_list.status_code == 200
    assert any(c["id"] == cb_id for c in admin_list.json())

    # Admin updates triage status to "In Review"
    upd_res = client.patch(
        f"/api/admin/doctor-callbacks/{cb_id}",
        json={"status": "In Review", "admin_notes": "Assigned to Dr. Manjunath on-call volunteer.", "assigned_to": "Dr. Manjunath"},
        headers=admin_headers,
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["status"] == "In Review"
    assert upd_res.json()["assigned_to"] == "Dr. Manjunath"


def test_unauthenticated_cannot_see_callback_phone(client):
    # Register Citizen A
    res_a = client.post("/api/auth/register", json={
        "name": "Citizen Alpha",
        "email": "alpha.unauth@example.com",
        "phone": "+91 91111 22222",
        "password": "alphapassword123",
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Citizen A creates incident
    inc_res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Patient needs doctor advice.",
        "location_name": "Koramangala",
        "help_required": "Tele-consultation",
        "contact_name": "Citizen Alpha",
        "contact_phone": "+91 91111 22222",
    }, headers=headers_a)
    inc_data = inc_res.json()
    inc_id = inc_data["id"]
    inc_code = inc_data["incident_code"]

    # Citizen A requests doctor callback with private phone
    cb_res = client.post(
        f"/api/incidents/{inc_id}/doctor-callback",
        json={
            "chief_complaint": "Persistent dizziness and palpitations.",
            "contact_phone": "+91 91111 22222",
        },
        headers=headers_a,
    )
    assert cb_res.status_code == 201

    # Unauthenticated request to incident detail:
    # Cannot see contact_phone (it must be None)
    unauth_res = client.get(f"/api/incidents/{inc_code}")
    assert unauth_res.status_code == 200
    unauth_cbs = unauth_res.json().get("doctor_callback_requests", [])
    assert len(unauth_cbs) >= 1
    assert unauth_cbs[0]["contact_phone"] is None
    assert unauth_cbs[0]["chief_complaint"] == "Persistent dizziness and palpitations."


def test_non_owner_cannot_see_callback_phone(client, db_session):
    from app.models import Incident, DoctorCallbackRequest

    # Create an incident without user_id (public / non-user-owned report)
    inc = Incident(
        incident_code="CARE-PUB-001",
        category="Medical",
        title="Public Incident",
        description="Public bystander report.",
        location_name="Public Park",
        help_required="First Aid",
        contact_name="Bystander",
        contact_phone="+91 92222 11111",
        user_id=None,
    )
    db_session.add(inc)
    db_session.commit()
    db_session.refresh(inc)

    # Add callback request to it
    cb = DoctorCallbackRequest(
        incident_id=inc.id,
        user_id=999,
        contact_name="Patient",
        contact_phone="+91 99999 88888",
        chief_complaint="Dizziness after heat exhaustion.",
        status="Pending",
    )
    db_session.add(cb)
    db_session.commit()

    # Register Citizen Beta (authenticated user who is NOT owner and NOT admin)
    res_b = client.post("/api/auth/register", json={
        "name": "Citizen Beta",
        "email": "beta.nonowner@example.com",
        "phone": "+91 93333 44444",
        "password": "betapassword123",
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Citizen Beta queries incident details
    res_b_view = client.get(f"/api/incidents/{inc.incident_code}", headers=headers_b)
    assert res_b_view.status_code == 200
    cbs = res_b_view.json().get("doctor_callback_requests", [])
    assert len(cbs) >= 1
    assert cbs[0]["contact_phone"] is None
    assert cbs[0]["chief_complaint"] == "Dizziness after heat exhaustion."


def test_owner_and_admin_can_see_callback_phone(client):
    # Register Citizen Owner
    res_owner = client.post("/api/auth/register", json={
        "name": "Citizen Owner",
        "email": "owner.cb@example.com",
        "phone": "+91 95555 66666",
        "password": "ownerpassword123",
    })
    token_owner = res_owner.json()["access_token"]
    headers_owner = {"Authorization": f"Bearer {token_owner}"}

    # Citizen Owner creates incident
    inc_res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Patient high fever.",
        "location_name": "Indiranagar",
        "help_required": "Doctor guidance",
        "contact_name": "Citizen Owner",
        "contact_phone": "+91 95555 66666",
    }, headers=headers_owner)
    inc_data = inc_res.json()
    inc_id = inc_data["id"]
    inc_code = inc_data["incident_code"]

    # Create doctor callback
    cb_res = client.post(
        f"/api/incidents/{inc_id}/doctor-callback",
        json={
            "chief_complaint": "Persistent 102F fever and chills.",
            "contact_phone": "+91 95555 66666",
        },
        headers=headers_owner,
    )
    assert cb_res.status_code == 201

    # Owner CAN see callback phone
    owner_view = client.get(f"/api/incidents/{inc_code}", headers=headers_owner)
    assert owner_view.status_code == 200
    owner_cbs = owner_view.json().get("doctor_callback_requests", [])
    assert len(owner_cbs) >= 1
    assert owner_cbs[0]["contact_phone"] == "+91 95555 66666"

    # Admin CAN see callback phone
    admin_login = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"})
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    admin_view = client.get(f"/api/incidents/{inc_code}", headers=admin_headers)
    assert admin_view.status_code == 200
    admin_cbs = admin_view.json().get("doctor_callback_requests", [])
    assert len(admin_cbs) >= 1
    assert admin_cbs[0]["contact_phone"] == "+91 95555 66666"


def test_system_config_and_official_emergency_line(client):
    conf_res = client.get("/api/config")
    assert conf_res.status_code == 200
    data = conf_res.json()
    assert "helpline_number" not in data or data.get("helpline_number") is None
    assert data["official_emergency_number"] == "112"
    assert "112" in data["official_emergency_disclaimer"]

    # Sahara fallback directly advises official 112 emergency line
    sahara_res = client.post("/api/chatbot/message", json={"message": "xyz unsupported inquiry"})
    assert sahara_res.status_code == 200
    assert "112" in sahara_res.json()["reply"]


def test_timezone_aware_utc_timestamp_serialization(client):
    reg_res = client.post("/api/auth/register", json={
        "name": "Tanvi Joshi",
        "email": "tanvi.tz@example.com",
        "phone": "+91 92222 33333",
        "password": "tanvipassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    inc_res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Fainting spell.",
        "location_name": "MG Road",
        "help_required": "First aid",
        "contact_name": "Tanvi Joshi",
        "contact_phone": "+91 92222 33333",
    }, headers=headers)
    created_at = inc_res.json()["created_at"]
    # Must end with Z indicating explicit UTC timezone awareness
    assert created_at.endswith("Z")
    assert "T" in created_at


def test_request_new_otp_endpoint(client):
    reg_res = client.post("/api/auth/register", json={
        "name": "Naveen Gowda",
        "email": "naveen.otp@example.com",
        "phone": "+91 91234 88888",
        "password": "naveenpassword123",
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create incident
    inc_res = client.post("/api/incidents", json={
        "category": "Road accident",
        "description": "Bike skid near ring road.",
        "location_name": "Ring Road Jn",
        "help_required": "First aid",
        "contact_name": "Naveen Gowda",
        "contact_phone": "+91 91234 88888",
    }, headers=headers)
    inc_id = inc_res.json()["id"]
    initial_otp = inc_res.json()["simulated_otp"]

    # Request new OTP
    req_otp_res = client.post(f"/api/incidents/{inc_id}/request-otp", headers=headers)
    assert req_otp_res.status_code == 200
    otp_data = req_otp_res.json()
    new_otp = otp_data["simulated_otp"]
    assert len(new_otp) == 6
    assert otp_data["incident_id"] == inc_id
    assert otp_data["expires_at"].endswith("Z")

    # Verify with new OTP
    v_res = client.post(f"/api/incidents/{inc_id}/verify", json={"otp": new_otp}, headers=headers)
    assert v_res.status_code == 200
    assert v_res.json()["is_verified"] is True

    # Requesting OTP for already verified incident fails
    post_verify_req = client.post(f"/api/incidents/{inc_id}/request-otp", headers=headers)
    assert post_verify_req.status_code == 400


def test_doctor_callback_validation_and_unauthorized_rejection(client):
    # Citizen
    c_res = client.post("/api/auth/register", json={
        "name": "Dr Callback Test",
        "email": "cb.test@example.com",
        "phone": "+91 96666 77777",
        "password": "cbtestpassword123",
    })
    token = c_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    inc_res = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Severe abdominal pain.",
        "location_name": "VV Mohalla",
        "help_required": "Triage consultation",
        "contact_name": "Dr Callback Test",
        "contact_phone": "+91 96666 77777",
    }, headers=headers)
    inc_id = inc_res.json()["id"]

    # Excessively long chief complaint (> 1000 chars) fails validation
    bad_cb = client.post(f"/api/incidents/{inc_id}/doctor-callback", json={"chief_complaint": "x" * 1001}, headers=headers)
    assert bad_cb.status_code == 422

    # 1-click callback with empty or short chief complaint succeeds
    ok_cb = client.post(f"/api/incidents/{inc_id}/doctor-callback", json={"chief_complaint": ""}, headers=headers)
    assert ok_cb.status_code == 201
    assert ok_cb.json()["chief_complaint"] == "Urgent Medical Consultation"

    # Normal user attempting to access admin callbacks -> 403
    forbidden_list = client.get("/api/admin/doctor-callbacks", headers=headers)
    assert forbidden_list.status_code == 403


def test_sahara_personalized_greeting_with_user_name(client):
    # Chat with user_name provided
    res = client.post("/api/chatbot/message", json={"message": "hello", "user_name": "Aastha Singh"})
    assert res.status_code == 200
    assert "Hey Aastha Singh! ❤️" in res.json()["reply"]

    # Chat without user_name -> generic GREETING
    res_generic = client.post("/api/chatbot/message", json={"message": "hello"})
    assert res_generic.status_code == 200
    assert "Hey there! ❤️" in res_generic.json()["reply"]


def test_sqlite_migration_idempotent():
    from app.database import run_db_migrations, engine
    # Running migration multiple times should be idempotent and succeed without errors
    run_db_migrations(engine)
    run_db_migrations(engine)


def test_postgres_migration_column_types():
    from app.database import get_migration_statements
    pg_stmts = dict(get_migration_statements("postgresql"))
    assert "TIMESTAMP WITH TIME ZONE" in pg_stmts["otp_expires_at"]
    assert "DATETIME" not in pg_stmts["otp_expires_at"]

    sqlite_stmts = dict(get_migration_statements("sqlite"))
    assert "DATETIME" in sqlite_stmts["otp_expires_at"]
    assert "TIMESTAMP WITH TIME ZONE" not in sqlite_stmts["otp_expires_at"]


def test_migration_raises_unexpected_errors(monkeypatch):
    from unittest.mock import MagicMock
    from app.database import run_db_migrations

    mock_engine = MagicMock()
    mock_inspector = MagicMock()
    mock_inspector.get_table_names.return_value = ["incidents"]
    mock_inspector.get_columns.return_value = [{"name": "id"}]

    monkeypatch.setattr("app.database.inspect", lambda eng: mock_inspector)

    mock_conn = MagicMock()
    mock_conn.execute.side_effect = RuntimeError("Fatal DB disk failure")
    mock_engine.begin.return_value.__enter__.return_value = mock_conn

    with pytest.raises(RuntimeError, match="Fatal DB disk failure"):
        run_db_migrations(mock_engine)


# ==============================================================================
# Smart Allocation & Conflict Prevention Tests
# ==============================================================================
def test_allocation_recommendation_and_conflict_prevention(client):
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create test incident
    inc_res = client.post("/api/incidents", json={
        "category": "Fire",
        "description": "Fire outbreak in shop.",
        "location_name": "South Fire Area",
        "latitude": 12.9300,
        "longitude": 77.5850,
        "affected_people": 1,
        "help_required": "Fire Response",
        "contact_name": "Fire Caller",
        "contact_phone": "+91 96666 55555",
    })
    inc_id = inc_res.json()["id"]

    # Recommend allocation
    rec_res = client.post("/api/allocations/recommend", json={"incident_id": inc_id})
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["has_allocation"] is True
    assert rec_data["resource_category"] == "Fire Response"
    res_id = rec_data["resource_id"]

    # Confirm assignment
    conf_res = client.post(
        "/api/allocations/confirm",
        json={"incident_id": inc_id, "resource_id": res_id},
        headers=headers,
    )
    assert conf_res.status_code == 200

    # Verify incident status is updated to Team Dispatched
    updated_inc = client.get(f"/api/incidents/{inc_id}").json()
    assert updated_inc["status"] == "Team Dispatched"

    # CONFLICT PREVENTION CHECK:
    # Try assigning the SAME resource to another incident -> must be blocked
    inc_res2 = client.post("/api/incidents", json={
        "category": "Fire",
        "description": "Second fire outbreak.",
        "location_name": "Jayanagar",
        "affected_people": 1,
        "help_required": "Fire Response",
        "contact_name": "Fire Caller 2",
        "contact_phone": "+91 96666 44444",
    })
    inc_id2 = inc_res2.json()["id"]

    conflict_res = client.post(
        "/api/allocations/confirm",
        json={"incident_id": inc_id2, "resource_id": res_id},
        headers=headers,
    )
    assert conflict_res.status_code == 400
    assert "conflict" in conflict_res.json()["detail"].lower() or "cannot be assigned" in conflict_res.json()["detail"].lower()


# ==============================================================================
# Shortage & External Provider Coordination Tests
# ==============================================================================
def test_shortage_detection_and_external_provider_flow(client):
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Get shortages
    shortage_res = client.get("/api/allocations/shortages")
    assert shortage_res.status_code == 200
    assert "shortages" in shortage_res.json()

    # List registered providers
    prov_res = client.get("/api/providers")
    assert prov_res.status_code == 200
    providers = prov_res.json()
    assert len(providers) >= 3

    # Pick St. Mary's or CityCare
    provider = providers[1]

    # Create enquiry for CARE-2026-103
    inc_103 = client.get("/api/incidents/CARE-2026-103").json()
    enquiry_res = client.post(
        "/api/providers/enquiries",
        json={
            "incident_id": inc_103["id"],
            "provider_id": provider["id"],
            "charge_quote": 1500.0,
            "user_consent": "Pending",
            "response_time_minutes": 12,
            "notes": "Simulated partner enquiry - provider confirmed vehicle standby.",
        },
        headers=headers,
    )
    assert enquiry_res.status_code == 201
    enquiry_id = enquiry_res.json()["id"]

    # Update provider status to Available & check consent
    patch_res = client.patch(
        f"/api/providers/enquiries/{enquiry_id}",
        json={"status": "Available", "charge_quote": 1500.0, "user_consent": "Accepted"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["user_consent"] == "Accepted"


# ==============================================================================
# Cancellation, Resolution & Feedback Tests
# ==============================================================================
def test_cancellation_and_safe_resource_release(client):
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create and dispatch an incident
    inc = client.post("/api/incidents", json={
        "category": "Medical",
        "description": "Patient dizzy, recovering.",
        "location_name": "MG Road Plaza",
        "affected_people": 1,
        "help_required": "First Aid",
        "contact_name": "Deepak",
        "contact_phone": "+91 95555 44444",
    }).json()

    # User cancels with reason
    cancel_res = client.post(
        f"/api/incidents/{inc['id']}/cancel",
        json={"reason": "Help arranged independently", "details": "Family took patient to nearby clinic."},
    )
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "Cancelled"

    # Admin acknowledges cancellation and releases resources
    ack_res = client.post(
        f"/api/incidents/{inc['id']}/acknowledge-cancellation",
        headers=headers,
    )
    assert ack_res.status_code == 200


def test_incident_resolution_and_feedback(client):
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create incident
    inc = client.post("/api/incidents", json={
        "category": "Safety / Other",
        "description": "Minor sports event sprain.",
        "location_name": "Stadium",
        "affected_people": 1,
        "help_required": "First Aid Kit",
        "contact_name": "Coach",
        "contact_phone": "+91 94444 33333",
    }).json()

    # Feedback before resolution must fail
    fb_early = client.post("/api/feedback", json={
        "incident_id": inc["id"],
        "rating": 5,
        "tags": "Great support",
    })
    assert fb_early.status_code == 400

    # Resolve incident
    res_res = client.post(
        f"/api/incidents/{inc['id']}/resolve",
        params={"notes": "Bandage applied and cleared safely."},
        headers=headers,
    )
    assert res_res.status_code == 200
    assert res_res.json()["status"] == "Resolved"

    # Feedback after resolution succeeds
    fb_res = client.post("/api/feedback", json={
        "incident_id": inc["id"],
        "rating": 5,
        "tags": "Clear updates, Helpful coordination",
        "comments": "Extremely fast and professional coordinator support.",
    })
    assert fb_res.status_code == 201
    assert fb_res.json()["rating"] == 5


# ==============================================================================
# Sahara Chatbot Intent Tests
# ==============================================================================
def test_sahara_chatbot_intent_matching(client):
    # Greeting
    res1 = client.post("/api/chatbot/message", json={"message": "Hello Sahara!"})
    assert res1.status_code == 200
    assert "Sahara" in res1.json()["reply"]

    # Medical triage safety disclaimer
    res2 = client.post("/api/chatbot/message", json={"message": "Can you diagnose severe chest pain?"})
    assert res2.status_code == 200
    reply = res2.json()["reply"]
    assert "cannot provide medical diagnoses" in reply or "112" in reply

    # Cost transparency explanation
    res3 = client.post("/api/chatbot/message", json={"message": "Does CareOn charge any fee?"})
    assert res3.status_code == 200
    assert "₹0" in res3.json()["reply"]

    # Track by incident code
    res4 = client.post("/api/chatbot/message", json={"message": "What is status of CARE-2026-101?"})
    assert res4.status_code == 200
    assert "CARE-2026-101" in res4.json()["reply"]


# ==============================================================================
# Security, Role Enforcement & Privacy Tests
# ==============================================================================
def test_public_registration_cannot_create_admin(client):
    # Attacker tries to register with role="admin"
    res = client.post("/api/auth/register", json={
        "name": "Malicious User",
        "email": "hacker@example.com",
        "phone": "+91 99999 88888",
        "password": "attackpassword123",
        "role": "admin",
    })
    assert res.status_code == 201
    data = res.json()
    # Backend security must force role to 'user'
    assert data["user"]["role"] == "user"

    # Verify they cannot access admin endpoints
    token = data["access_token"]
    admin_probe = client.get("/api/admin/analytics", headers={"Authorization": f"Bearer {token}"})
    assert admin_probe.status_code == 403


def test_password_mismatch_registration_fails(client):
    res = client.post("/api/auth/register", json={
        "name": "Mismatch User",
        "email": "mismatch@example.com",
        "phone": "+91 98888 77777",
        "password": "passwordA123",
        "confirm_password": "passwordB999",
    })
    assert res.status_code == 400
    assert "Passwords do not match" in res.json()["detail"]


def test_demo_account_names_verification(client):
    # Verify Admin account is Aastha Singh
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@careon.org",
        "password": "admin123",
    })
    assert admin_login.status_code == 200
    assert admin_login.json()["user"]["name"] == "Aastha Singh"
    assert admin_login.json()["user"]["role"] == "admin"

    # Verify Demo User account is Demo User
    user_login = client.post("/api/auth/login", json={
        "email": "aastha@example.com",
        "password": "user123",
    })
    assert user_login.status_code == 200
    assert user_login.json()["user"]["name"] == "Demo User"
    assert user_login.json()["user"]["role"] == "user"


def test_private_user_incident_access_restriction(client):
    # User A reports an incident
    user_a = client.post("/api/auth/register", json={
        "name": "User Alpha",
        "email": "alpha@example.com",
        "phone": "+91 98765 11111",
        "password": "alphapassword123",
    }).json()
    token_a = user_a["access_token"]

    inc = client.post(
        "/api/incidents",
        json={
            "category": "Medical",
            "description": "Confidential patient condition.",
            "location_name": "Mysuru Palace West Gate",
            "affected_people": 1,
            "help_required": "First Aid",
            "contact_name": "User Alpha",
            "contact_phone": "+91 98765 11111",
        },
        headers={"Authorization": f"Bearer {token_a}"},
    ).json()
    inc_code = inc["incident_code"]

    # User B registers
    user_b = client.post("/api/auth/register", json={
        "name": "User Beta",
        "email": "beta@example.com",
        "phone": "+91 98765 22222",
        "password": "betapassword123",
    }).json()
    token_b = user_b["access_token"]

    # User B attempts to access User A's private incident -> HTTP 403 Forbidden
    res_b = client.get(
        f"/api/incidents/{inc_code}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert res_b.status_code == 403
    assert "Access denied" in res_b.json()["detail"]

    # Admin CAN access User A's incident -> HTTP 200 OK
    admin_login = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"}).json()
    res_admin = client.get(
        f"/api/incidents/{inc_code}",
        headers={"Authorization": f"Bearer {admin_login['access_token']}"},
    )
    assert res_admin.status_code == 200
    assert res_admin.json()["incident_code"] == inc_code


def test_demo_resource_seeding_in_development(monkeypatch):
    """Verify that development mode seeds all Mysuru demo fleet resources."""
    from app.database import Base
    from app.models import Resource, User, ExternalProvider
    from app import crud
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    monkeypatch.setenv("ENVIRONMENT", "development")
    monkeypatch.delenv("SEED_DEMO_DATA", raising=False)

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        crud.seed_demo_data(db)
        resources = db.query(Resource).all()
        resource_codes = {r.resource_code for r in resources}
        expected_codes = {
            "AMB-01", "AMB-02", "AMB-03", "MED-01",
            "FIRE-01", "RES-01", "REL-01", "SHELTER-01"
        }
        assert expected_codes.issubset(resource_codes)
        assert len(resources) == 8

        # Ensure demo users and external providers are present in dev
        assert db.query(User).filter(User.email == "admin@careon.org").first() is not None
        assert db.query(ExternalProvider).count() > 0
    finally:
        db.close()


def test_demo_resource_seeding_suppressed_in_production(monkeypatch):
    """Verify that production mode with SEED_DEMO_DATA=false does not seed demo resources."""
    from app.database import Base
    from app.models import Resource, User, Incident, ExternalProvider, Emergency
    from app import crud
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("SEED_DEMO_DATA", "false")
    monkeypatch.setenv("ADMIN_EMAIL", "prodadmin@careon.org")
    monkeypatch.setenv("ADMIN_PASSWORD", "SuperSecurePassword123!")
    monkeypatch.setenv("CAREON_SECRET_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        crud.seed_demo_data(db)

        # Verify zero demo fleet resources in production
        assert db.query(Resource).count() == 0

        # Verify zero demo external providers
        assert db.query(ExternalProvider).count() == 0

        # Verify zero demo incidents or legacy emergencies
        assert db.query(Incident).count() == 0
        assert db.query(Emergency).count() == 0

        # Verify demo accounts are NOT created
        assert db.query(User).filter(User.email == "admin@careon.org").first() is None
        assert db.query(User).filter(User.email == "aastha@example.com").first() is None
        assert db.query(User).filter(User.email == "rahul@example.com").first() is None

        # Verify production admin was bootstrapped
        prod_admin = db.query(User).filter(User.email == "prodadmin@careon.org").first()
        assert prod_admin is not None
        assert prod_admin.role == "admin"
        assert prod_admin.name == "Command Centre Administrator"
    finally:
        db.close()


def test_production_forbids_demo_seeding_even_with_flag(monkeypatch):
    """Verify that ENVIRONMENT=production strictly ignores SEED_DEMO_DATA=true and creates only configured admin."""
    from app.database import Base
    from app.models import Resource, User, Incident, ExternalProvider, Emergency
    from app import crud
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("SEED_DEMO_DATA", "true")  # Explicit true should be ignored in production
    monkeypatch.setenv("ADMIN_EMAIL", "prodadmin@careon.org")
    monkeypatch.setenv("ADMIN_PASSWORD", "SuperSecurePassword123!")
    monkeypatch.setenv("CAREON_SECRET_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        crud.seed_demo_data(db)

        # Zero demo fleet resources and zero demo providers in production
        assert db.query(Resource).count() == 0
        assert db.query(ExternalProvider).count() == 0

        # Zero demo incidents and zero legacy emergencies
        assert db.query(Incident).count() == 0
        assert db.query(Emergency).count() == 0

        # Assert demo admin, aastha@example.com and rahul@example.com are NOT created
        assert db.query(User).filter(User.email == "admin@careon.org").first() is None
        assert db.query(User).filter(User.email == "aastha@example.com").first() is None
        assert db.query(User).filter(User.email == "rahul@example.com").first() is None

        # Assert configured production admin IS created
        prod_admin = db.query(User).filter(User.email == "prodadmin@careon.org").first()
        assert prod_admin is not None
        assert prod_admin.role == "admin"
        assert prod_admin.name == "Command Centre Administrator"
    finally:
        db.close()


def test_production_admin_collision_preserves_citizen(monkeypatch, capsys):
    """Verify that admin bootstrap does not modify an existing citizen user's role or password."""
    from app.database import Base
    from app.models import User
    from app import crud, auth
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ADMIN_EMAIL", "resident@example.com")
    monkeypatch.setenv("ADMIN_PASSWORD", "AttemptedAdminPass123!")
    monkeypatch.setenv("CAREON_SECRET_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        # Pre-register ordinary citizen
        citizen = User(
            email="resident@example.com",
            name="Resident Reporter",
            phone="+91 99999 11111",
            hashed_password=auth.hash_password("CitizenSecretPass!"),
            role="user",
            trust_score="Confirmed Genuine",
            trust_notes="Verified resident reporter",
        )
        db.add(citizen)
        db.commit()

        # Run startup seeding
        crud.seed_demo_data(db)

        # Assert citizen account role, password, and details remain completely unchanged
        user = db.query(User).filter(User.email == "resident@example.com").first()
        assert user is not None
        assert user.role == "user"
        assert auth.verify_password("CitizenSecretPass!", user.hashed_password) is True
        assert auth.verify_password("AttemptedAdminPass123!", user.hashed_password) is False
        assert user.name == "Resident Reporter"
        assert user.phone == "+91 99999 11111"
        assert db.query(User).filter(User.email == "resident@example.com").count() == 1

        # Check security warning printed
        captured = capsys.readouterr()
        assert "[CareOn Security Warning]" in captured.out
        assert "resident@example.com" in captured.out
    finally:
        db.close()


def test_admin_persistent_notifications_and_mark_all_read(client):
    admin_login = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"}).json()
    admin_headers = {"Authorization": f"Bearer {admin_login['access_token']}"}

    # Retrieve coordinator notifications
    res = client.get("/api/admin/notifications", headers=admin_headers)
    assert res.status_code == 200
    notifs = res.json()
    assert isinstance(notifs, list)

    # Mark all as read
    mark_res = client.post("/api/admin/notifications/mark-all-read", headers=admin_headers)
    assert mark_res.status_code == 200
    assert mark_res.json()["status"] == "success"

    # Verify unread list is now empty
    unread_res = client.get("/api/admin/notifications?unread_only=true", headers=admin_headers)
    assert unread_res.status_code == 200
    assert len(unread_res.json()) == 0


def test_explainable_multi_factor_allocation(client):
    admin_login = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"}).json()
    admin_headers = {"Authorization": f"Bearer {admin_login['access_token']}"}

    # Check allocation recommendations include explainable factors and confidence score
    res = client.post("/api/allocations/multi-recommend", headers=admin_headers)
    assert res.status_code == 200
    allocations = res.json()
    assert isinstance(allocations, list)
    if len(allocations) > 0:
        alloc = allocations[0]
        assert "algorithm_type" in alloc
        assert "Explainable Multi-Factor Scoring" in alloc["algorithm_type"]
        assert "confidence_score" in alloc
        assert "auto_dispatch_recommended" in alloc
        assert "requires_admin_approval" in alloc
        assert "decision_reason" in alloc


def test_in_app_otp_delivery_and_notification_isolation(client):
    """
    Verify in-app notification OTP delivery and privacy isolation:
    - Authenticated citizen reporting an emergency receives an in-app OTP notification.
    - Other citizens, unauthenticated callers, and admin notifications cannot see user's OTP.
    - Regenerating OTP delivers a fresh OTP notification.
    - OTP verification succeeds and prevents reuse.
    """
    # 1. Citizen A registers and logs in
    user_a_email = f"citizen_a_{os.urandom(4).hex()}@careon.org"
    reg_a = client.post("/api/auth/register", json={
        "name": "Citizen A",
        "email": user_a_email,
        "phone": "+91 98888 11111",
        "password": "password123",
    })
    assert reg_a.status_code == 201
    token_a = reg_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Citizen A reports an emergency
    rep_res = client.post(
        "/api/incidents",
        headers=headers_a,
        json={
            "category": "Medical",
            "description": "Severe chest pain and difficulty breathing.",
            "location_name": "Mysuru Palace North Gate",
            "latitude": 12.3052,
            "longitude": 76.6552,
            "affected_people": 1,
            "help_required": "Cardiac Ambulance",
            "contact_name": "Citizen A",
            "contact_phone": "+91 98888 11111",
        },
    )
    assert rep_res.status_code == 201
    rep_data = rep_res.json()
    incident_id = rep_data["id"]
    incident_code = rep_data["incident_code"]
    initial_otp = rep_data["simulated_otp"]
    assert initial_otp is not None
    assert len(initial_otp) == 6

    # 3. Citizen A fetches notifications -> OTP notification is present
    notifs_a = client.get("/api/notifications", headers=headers_a).json()
    otp_notifs_a = [
        n for n in notifs_a
        if f"Emergency Verification Code ({incident_code})" in n["title"]
    ]
    assert len(otp_notifs_a) == 1
    assert f"Your CareOn verification code is: {initial_otp}" in otp_notifs_a[0]["message"]
    assert "(In-App Demo OTP)" in otp_notifs_a[0]["message"]

    # 4. Citizen B registers and logs in
    user_b_email = f"citizen_b_{os.urandom(4).hex()}@careon.org"
    reg_b = client.post("/api/auth/register", json={
        "name": "Citizen B",
        "email": user_b_email,
        "phone": "+91 98888 22222",
        "password": "password123",
    })
    assert reg_b.status_code == 201
    token_b = reg_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Citizen B cannot see Citizen A's OTP notification
    notifs_b = client.get("/api/notifications", headers=headers_b).json()
    b_leaked_otps = [
        n for n in notifs_b
        if incident_code in n["title"] or "Verification Code" in n["title"]
    ]
    assert len(b_leaked_otps) == 0

    # 5. Unauthenticated visitor cannot see Citizen A's OTP notification
    notifs_unauth = client.get("/api/notifications").json()
    unauth_leaked_otps = [
        n for n in notifs_unauth
        if incident_code in n["title"] or "Verification Code" in n["title"]
    ]
    assert len(unauth_leaked_otps) == 0

    # 6. Admin notifications do not expose the private OTP notification
    admin_login = client.post("/api/auth/login", json={"email": "admin@careon.org", "password": "admin123"}).json()
    admin_headers = {"Authorization": f"Bearer {admin_login['access_token']}"}
    admin_notifs = client.get("/api/admin/notifications", headers=admin_headers).json()
    admin_leaked_otps = [
        n for n in admin_notifs
        if "Emergency Verification Code" in n["title"]
    ]
    assert len(admin_leaked_otps) == 0

    # 7. Citizen A requests a new OTP
    req_new = client.post(f"/api/incidents/{incident_id}/request-otp", headers=headers_a)
    assert req_new.status_code == 200
    new_otp = req_new.json()["simulated_otp"]
    assert new_otp is not None
    assert len(new_otp) == 6

    # Fresh notification delivered to Citizen A
    notifs_a_updated = client.get("/api/notifications", headers=headers_a).json()
    new_otp_notifs = [
        n for n in notifs_a_updated
        if f"Your CareOn verification code is: {new_otp}" in n["message"]
    ]
    assert len(new_otp_notifs) == 1

    # 8. Verify with the new OTP
    ver_res = client.post(
        f"/api/incidents/{incident_id}/verify",
        headers=headers_a,
        json={"otp": new_otp},
    )
    assert ver_res.status_code == 200
    assert ver_res.json()["is_verified"] is True

    # 9. Invalidation & Anti-Reuse: Verifying again fails with 400 already_verified
    reuse_res = client.post(
        f"/api/incidents/{incident_id}/verify",
        headers=headers_a,
        json={"otp": new_otp},
    )
    assert reuse_res.status_code == 400
    assert "already verified" in reuse_res.json()["detail"]
