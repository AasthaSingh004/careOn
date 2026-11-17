# CareOn — Hospital Emergency Response & Real-Time Dispatch System

CareOn is a high-reliability, microservices-based emergency response and dispatch platform engineered for clinical facilities. It empowers triage nurses, physicians, and emergency room dispatchers to broadcast critical alerts, monitor patient vitals, track responder status, and maintain real-time situational awareness across hospital wards.

---

## 🎯 Mandatory CDD Requirements Summary

This repository fulfills the three compulsory CDD requirements for CI/CD, GitHub Actions, and Docker containerization:

### 1. Fully Functional CI/CD Pipeline
- **Source Code Checkout & Dependency Validation**: Automated matrix for Python 3.11 and Node.js 20.
- **Automated Backend Testing**: 15 comprehensive Pytest test cases covering API endpoints, triage validation rules, error handling, and database persistence.
- **Automated Frontend Testing & Production Build**: Vitest component testing and Vite production bundle compilation.
- **Docker Image Building & Compose Verification**: Multi-container build, healthcheck evaluation, automated emergency dispatch, and persistent data verification across container teardown and restart.
- **Automated Deployment-Readiness**: Verifies container manifests and provides an automated SSH deployment pipeline via GitHub Secrets.

### 2. GitHub Actions Integration
All CI/CD automation workflows are implemented inside [`.github/workflows/`](file:///.github/workflows/):
- **[`ci.yml`](file:///.github/workflows/ci.yml)**: Automated backend Pytest execution, code validation, frontend Vitest tests, and React production build with artifact archiving.
- **[`docker.yml`](file:///.github/workflows/docker.yml)**: Automated Docker Compose building, multi-container orchestration, healthcheck polling, emergency injection, and database volume persistence verification across container restarts.
- **[`deploy.yml`](file:///.github/workflows/deploy.yml)**: Production image packaging with Git commit SHA tagging, release manifest generation, secure SSH-based deployment if secrets are configured, or automated deployment-readiness audit if no remote host is attached.

### 3. Effective Docker Utilization
- **Backend Container (`careon-backend`)**: Containerized FastAPI service running on Python 3.11 with automated healthcheck probes on port `8000`.
- **Frontend Container (`careon-frontend`)**: Multi-stage build (Node.js 20 builder + Nginx Alpine runtime) serving the React 18 SPA and reverse-proxying `/api/` calls to the backend on host port `3000`.
- **Docker Compose Orchestration ([`docker-compose.yml`](file:///docker-compose.yml))**: Links frontend and backend containers via an isolated bridge network (`careon-net`).
- **Guaranteed Database Persistence**: Uses a named Docker volume (`careon_data`) mounted at `/data` inside the backend container to ensure SQLite data persists across container recreations and restarts.

---

## 🏗️ System Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                      CAREON HOST                       │
                  │                                                        │
                  │   Browser Access  ──▶ Host Port 3000                   │
                  │   Direct API / Docs ─▶ Host Port 8000                  │
                  └──────────────┬────────────────────────┬────────────────┘
                                 │                        │
                    ┌────────────▼──────────┐ ┌───────────▼───────────┐
                    │    careon-frontend    │ │    careon-backend     │
                    │  (Port 80 -> Host 3000) │ (Port 8000 -> Host 8000)│
                    │  Nginx + React 18     │ │  FastAPI + Uvicorn    │
                    └────────────┬──────────┘ └───────────▲───────────┘
                                 │                        │
                                 │   careon-net (Bridge)  │
                                 └── Proxy: /api/* ───────┘
                                                          │
                                             ┌────────────▼───────────┐
                                             │ Named Docker Volume    │
                                             │ (careon_data -> /data) │
                                             │ SQLite: careon.db      │
                                             └────────────────────────┘
```

---

## ⚡ Quick Start: Running with Docker Compose

Ensure Docker Desktop or Docker Engine is running on your machine.

### 1. Build and Start the Application
```bash
docker compose up -d --build
```

### 2. Verify Running Containers
```bash
docker compose ps
```
Both `careon-backend` and `careon-frontend` will report `Up (healthy)`.

### 3. Open the Application
- **CareOn Web Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Direct**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📋 Docker Operations & Demonstration Commands

| Operation | Exact Command | Purpose |
|---|---|---|
| **1. Build Images** | `docker compose build` | Compiles backend and frontend Dockerfiles |
| **2. List Images** | `docker images \| grep careon` | Displays local `careon-backend` and `careon-frontend` images |
| **3. Start Containers**| `docker compose up -d` | Runs services in detached background mode |
| **4. List Containers** | `docker compose ps` | Displays container IDs, ports, status, and healthcheck results |
| **5. View Logs** | `docker compose logs -f` | Streams consolidated logs (`docker compose logs -f backend`) |
| **6. Access App** | Browser: `http://localhost:3000` | Opens the React Emergency Response Dashboard |
| **7. Stop Containers** | `docker compose down` | Stops and removes containers while preserving volume data |
| **8. Restart Containers**| `docker compose restart` | Reboots the containers safely |
| **9. Verify Persistence**| See test sequence below | Mathematically proves SQLite data survives container destruction |

### Database Persistence Test Sequence
```bash
# 1. Dispatch a test emergency alert
curl -s -X POST http://localhost:8000/api/emergencies \
  -H "Content-Type: application/json" \
  -d '{"patient_name":"Persistence Test Patient","room_number":"ICU-DEMO","emergency_type":"Cardiac","priority":"Critical"}'

# 2. Tear down the containers completely
docker compose down

# 3. Start the containers again
docker compose up -d

# 4. Fetch the emergency record by ID (e.g., ID 4 or 5)
curl -s http://localhost:8000/api/emergencies/4
```
*The patient record is returned intact from the mounted Docker volume!*

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests (Pytest)
```bash
# Run 15 automated test cases locally
PYTHONPATH=backend pytest backend/tests/ -v
```

### Frontend Component Tests (Vitest)
```bash
cd frontend
npm test
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 📖 Comprehensive DevOps Guide

For deep technical details, CI/CD theory, Docker architecture diagrams, deployment instructions, and faculty demonstration guides, refer to the complete documentation in:

👉 **[`docs/DEVOPS.md`](file:///docs/DEVOPS.md)**
