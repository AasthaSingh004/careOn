# CareOn — Intelligent Emergency Resource Coordination Platform
> **“Help is closer than you think.”**  
> Educational prototype for college project faculty demonstration.

CareOn coordinates emergency incidents, available response teams (ambulances, medical trauma units, fire crews, rescue squads), NGOs, relief centres, and external service providers when resources are limited.

---

## 🌟 Product Identity & Overview

- **Product Name:** CareOn
- **Tagline:** *Help is closer than you think.*
- **Product Type:** Intelligent Emergency Resource Coordination Platform (Decision-support & coordination prototype)
- **Chatbot Companion:** Sahara (*Your caring emergency support companion.*)
- **Key Problem Solved:** When multiple emergencies occur simultaneously in high-density urban areas, the nearest resource is not always available or suitable. CareOn prioritizes incidents, matches specialist capabilities, prevents double-assignments, detects shortages, and coordinates vetted external partners with transparent cost consent.

---

## 🚀 Quick Run Instructions (macOS)

### Option A: Running with Docker Compose (Recommended)

1. **Build and launch both containers:**
   ```bash
   docker compose up -d --build
   ```

2. **Verify container health:**
   ```bash
   docker compose ps
   ```
   Both `careon-backend` and `careon-frontend` will report `Up (healthy)`.

3. **Open the application:**
   - **User Application & Admin Command Centre:** [http://localhost:3000](http://localhost:3000)
   - **Backend API & Health:** [http://localhost:8000/api/health](http://localhost:8000/api/health)
   - **Interactive API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

4. **Stop containers (Volume data persists):**
   ```bash
   docker compose down
   ```

---

### Option B: Running Locally on Bare Metal (macOS)

#### 1. Backend Setup (FastAPI + SQLite)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Backend will be live at `http://0.0.0.0:8000` (listening on all local interfaces).

#### 2. Frontend Setup (React + Vite)
In a new terminal:
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```
Frontend will be live at `http://localhost:3000`.

---

## 📱 Multi-Device Local Network Access (Laptops & Android Phones)

CareOn is architected to allow friends and faculty to access the platform from their own laptops and mobile devices on the same Wi-Fi network without installing any development software:

1. **Find your Mac's Local IP Address:**
   ```bash
   ipconfig getifaddr en0
   ```
   *(Example local IP on this network: `10.10.32.19`)*

2. **Open from Android Phone or Second Laptop:**
   - Open mobile browser and navigate to:
     ```
     http://10.10.32.19:3000
     ```
   - **Automatic Dynamic API Discovery:** The frontend dynamically targets `http://<Current-Host>:8000/api`, ensuring zero hardcoded `localhost` issues across devices.
   - **Wi-Fi Troubleshooting:** Ensure both devices are connected to the same Wi-Fi network and that macOS Firewall permits incoming connections on ports `3000` and `8000`.

---

## 🔑 Demo Login Credentials

CareOn comes pre-seeded with realistic fictional data ready for immediate faculty demonstration:

| Role | Account Email | Password | Display Name & Description |
|---|---|---|---|
| **Administrator (Coordinator)** | `admin@careon.org` | `admin123` | **Coordinator Rajesh Rao** — Full access to Command Centre, allocation approvals, shortage management, and fleet status |
| **Normal User (Reporter)** | `aastha@example.com` | `user123` | **Aastha Singh** (+91 98765 43210) — Incident reporting, request tracking, cost consent, and cancellation |
| **Second Reporter** | `rahul@example.com` | `user123` | **Rahul Sharma** (+91 98450 11223) — Road accident reporter |

*Quick Demo Switcher:* Click on the user pill at the top right of the navigation bar to switch between Aastha Singh and Coordinator Rajesh Rao in 1 click!

---

## 🎯 Compulsory CDD Requirements: CI/CD, GitHub Actions & Docker

### 1. Fully Functional CI/CD Pipeline
- **Automated Matrix:** Python 3.11 and Node.js 20 on Ubuntu latest.
- **Backend Automated Tests:** 25 comprehensive Pytest test cases covering authentication, access control, triage classification, double-assignment conflict prevention, shortage detection, external partner consent, cancellation flows, and database persistence.
- **Frontend Build & Test Checks:** Vitest test suite and minified production bundle compilation (`vite build`).
- **Persistence Verification:** Automated container restart test proving that SQLite clinical records in named volume `careon_data` survive teardown.

### 2. GitHub Actions Workflows
Located inside [`.github/workflows/`](file:///.github/workflows/):
- **[`ci.yml`](file:///.github/workflows/ci.yml)**: Backend Pytest execution, module validation, frontend Vitest tests, and production build artifact upload.
- **[`docker.yml`](file:///.github/workflows/docker.yml)**: Docker Compose building, healthcheck verification, automated emergency injection, container teardown (`down`), recreation (`up`), and database volume survival verification.
- **[`deploy.yml`](file:///.github/workflows/deploy.yml)**: Production container image tagging, release manifest creation, and deployment-readiness validation.

### 3. Effective Docker Utilization
- **Backend Container (`careon-backend`)**: Python 3.11 slim image with healthcheck probe on port 8000.
- **Frontend Container (`careon-frontend`)**: Multi-stage build (Node.js 20 build stage + Nginx Alpine runtime) reverse-proxying `/api/` to the backend on port 3000.
- **Docker Compose (`docker-compose.yml`)**: Bridges containers over `careon-net` with persistent storage volume `careon_data` mounted at `/data`.

For full DevOps details, refer to the dedicated guide: **[`docs/DEVOPS.md`](file:///docs/DEVOPS.md)**.

---

## 🎓 Faculty Presentation Demonstration Script

Follow this repeatable scenario: **The Resource Shortage Challenge**:

1. **Log in as Administrator:**
   - Navigate to [http://localhost:3000](http://localhost:3000) and click **Admin Command Centre** (or select *Coordinator Rajesh (Admin)* from the top right switcher).
2. **Review Fleet Status:**
   - Show available resources: 1 ambulance (`AMB-02`), 1 fire tender (`FIRE-01`), 1 medical team (`MED-01`), 1 relief vehicle (`REL-01`), and 1 maintenance unit (`AMB-03`).
3. **Inspect 3 Simultaneous Incidents:**
   - `CARE-2026-101`: Critical Cardiac Emergency on MG Road (Already assigned to `AMB-01`).
   - `CARE-2026-102`: High Road Accident in Koramangala.
   - `CARE-2026-103`: Critical Commercial Kitchen Fire in Indiranagar.
4. **Demonstrate Conflict Prevention:**
   - Attempt to assign occupied `AMB-01` to another incident: CareOn backend blocks the action with a clear conflict alert.
5. **Smart Allocation:**
   - Assign the single available ambulance (`AMB-02`) to `CARE-2026-102`.
6. **Shortage Detection & Partner Coordination:**
   - Open **Smart Allocation & Shortages** tab. Point out the shortage alert for `CARE-2026-103`.
   - Click **Simulate Partner Contact** for *CityCare Private Ambulance Fleet*.
   - Record the simulated quotation (₹1,500) and dispatch inquiry.
7. **Cost Transparency & User Consent:**
   - Switch to **Track Request** tab and load `CARE-2026-103`.
   - Show the cost breakdown: CareOn fee: **₹0**, Provider quotation: **₹1,500**, Subsidy: **₹500**.
   - Click **Accept Quotation** as the user to grant informed consent.
8. **Live Dispatch & Simulated Movement:**
   - Open **Live Map & Dispatch** tab.
   - Click **Simulate Live Dispatch Movement** to show the vehicle progressing along the corridor with ETA tracking.
9. **User-Initiated Cancellation:**
   - In **Track Request**, click **Cancel Request** for a report and choose *Emergency resolved*.
   - In Admin Command Centre, show the cancellation log and click **Release Fleet** to safely return units to available status.
10. **Resolution & Feedback:**
    - Resolve an incident and submit a 5-star rating with tags.
    - Show the updated score in **Analytics & ML Predictions**.
11. **Sahara Chatbot:**
    - Open the floating Sahara widget at the bottom right.
    - Type *"What is status of CARE-2026-101?"* and show Sahara fetching real-time dispatch details.
    - Ask *"Can you diagnose severe chest pain?"* to demonstrate medical safety boundaries and 112 redirection.
12. **One-Click Reset:**
    - Click **Reset Demo State** in the Admin header to clean and reseed data for the next demonstration.

---

## 🔒 Implemented vs. Simulated Features

| Feature Area | Status | Implementation Details |
|---|---|---|
| **Incident Reporting & Triage** | Real Implementation | Form validation, rule-based urgency classifier, duplicate similarity detector |
| **Database Persistence** | Real Implementation | SQLite database with relational constraints and Docker persistent volume |
| **Smart Resource Allocation** | Real Implementation | Haversine distance, capability matching, strict transaction-level conflict prevention |
| **Auth & Access Control** | Real Implementation | PBKDF2-HMAC password hashing, signed bearer tokens, role checks |
| **Multi-Language Support** | Real Implementation | Central translation dictionary for English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ) |
| **Sahara Chatbot** | Real Implementation | Rule-based intent-matching engine, real-time database query, medical safety disclaimers |
| **Live Map Tracking** | Real Implementation | Leaflet OpenStreetMap with custom pins, coordinate popups, and offline table fallback |
| **Vehicle Movement** | Clearly Labelled Simulation | Front-end animated movement across map coordinates with visible simulation badge |
| **Phone OTP Verification** | Clearly Labelled Simulation | Local demo verification using code `123456` (no paid SMS gateway required) |
| **External Provider Dispatch** | Clearly Labelled Simulation | Simulated partner enquiry, recorded quotation, and user consent step |
| **ML Shortage Prediction** | Prototype Baseline | Zone demand regression model with time-of-day multipliers and available fleet buffer |

---

## 🧪 Automated Testing

### Run Backend Pytest Suite (25 Tests)
```bash
source backend/venv/bin/activate
pytest backend/tests/ -v
```

### Run Frontend Vitest Suite (4 Tests)
```bash
cd frontend
npm test
```

### Run Frontend Production Build Check
```bash
cd frontend
npm run build
```

---

## 📄 License & Disclaimer

CareOn is built as an educational prototype for academic review. In case of real emergencies, dial **112** or **108** immediately.
