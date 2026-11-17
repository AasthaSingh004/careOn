# CareOn DevOps & Engineering Guide: CI/CD, GitHub Actions, and Docker

> **Course / CDD Mandatory Deliverable**: Continuous Integration, Automated Deployment Readiness, and Docker Containerization with Database Persistence.

---

## 1. Executive Summary

**CareOn** is a mission-critical hospital emergency response and dispatch platform. Because healthcare workflows require extreme reliability, deterministic deployment, and data integrity, CareOn implements an enterprise-grade DevOps strategy comprising:

1. **Fully Automated CI/CD Pipeline**: GitHub Actions workflows validating backend Pytest suites, frontend React builds, container healthchecks, and deployment readiness on every commit and pull request.
2. **Containerized Multi-Service Architecture**: Independent containerization of the FastAPI backend and React frontend orchestrated via Docker Compose.
3. **Guaranteed Data Persistence**: Isolated Docker volume mounting ensuring that clinical emergency records and triage statistics survive container restarts, rebuilds, and crashes.
4. **Zero-Trust Security**: No plaintext secrets or tokens hardcoded in configuration files; deployment keys managed via GitHub Actions Secrets.

---

## 2. What CI/CD Means

**CI/CD** stands for **Continuous Integration** and **Continuous Delivery** (or **Continuous Deployment**). It represents a modern software engineering culture, set of principles, and collection of automated practices:

```
[ Developer Commit ] 
         │
         ▼
[ Continuous Integration (CI) ] ──▶ Code Checkout ──▶ Dependency Install ──▶ Pytest & Vitest ──▶ Frontend Build
         │ (Fails build on any test error)
         ▼
[ Container Validation ] ────────▶ Build Dockerfiles ──▶ Compose Up ──▶ Healthchecks ──▶ Persistence Test
         │
         ▼
[ Continuous Delivery (CD) ] ────▶ Tag Release ──▶ Release Manifest ──▶ Automated Deployment / Readiness Audit
```

### Continuous Integration (CI)
Continuous Integration is the practice of automating the integration of code changes from multiple contributors into a shared repository several times a day.
- Every commit or pull request automatically triggers an automated runner.
- The runner checks out the source code, installs runtime dependencies, executes automated test suites (Pytest for Python, Vitest for React), and verifies production builds.
- **Goal**: Detect integration bugs, regressions, syntax errors, and broken dependencies immediately rather than at release time. If any test or build fails, the pipeline immediately halts and marks the build as failed.

### Continuous Delivery (CD)
Continuous Delivery is an automated extension of CI where code changes that pass all integration stages are packaged into a deployable artifact (such as Docker images or release manifests) and verified as release-ready.
- In **Continuous Delivery**, deployment to staging or production can be triggered automatically or via a one-click manual release gate.
- In **Continuous Deployment**, every change that passes all pipeline gates is deployed automatically to production with zero human intervention.

---

## 3. How CareOn Implements CI/CD

CareOn implements CI/CD with strict validation gates:

| Stage | Responsibility | Failure Policy |
|---|---|---|
| **Code Checkout & Environment** | Checks out Git ref; sets up Python 3.11 and Node.js 20 | Fails immediately on missing files or invalid syntax. |
| **Backend Testing** | Installs `requirements.txt`; executes 15 Pytest test cases against SQLite in-memory engine | Fails pipeline if any test fails, assertion fails, or unhandled exception occurs. |
| **Frontend Testing & Build** | Installs `package-lock.json` via `npm ci`; executes 4 Vitest test cases; runs Vite production build | Fails pipeline if component assertions fail or if bundle compilation errors out. |
| **Docker Build & Orchestration** | Builds `careon-backend:latest` and `careon-frontend:latest`; starts services via Docker Compose | Fails if Dockerfile layers fail, ports cannot bind, or healthchecks time out. |
| **Persistence Verification** | Submits a test emergency record; tears down containers (`docker compose down`); restarts (`docker compose up -d`); queries the record | Fails if the SQLite database in the Docker volume was wiped or corrupted. |
| **Deployment Gate** | Tags images with commit SHA; evaluates remote SSH secrets; executes deployment or produces verified release readiness report | Halts if target host is unreachable or image signatures fail. |

---

## 4. GitHub Actions Automation

GitHub Actions serves as the cloud-native CI/CD automation engine for CareOn. It uses declarative YAML configuration files located in `.github/workflows/`.

### Architecture of GitHub Actions in CareOn
- **Events & Triggers**: Workflows trigger automatically on `push` to `main`/`master`, on `pull_request` creation and updates, and manually via `workflow_dispatch`.
- **Runners**: Workflows execute on isolated, standardized cloud virtual environments (`ubuntu-latest`).
- **Caching**: Pip wheels and npm modules are cached based on hash keys of `requirements.txt` and `package-lock.json` for rapid pipeline execution.
- **Fail-Fast Policy**: If any job fails, subsequent deployment jobs are blocked from proceeding.
- **Secrets Management**: Host addresses, SSH credentials, and container registry access keys are stored in encrypted repository secrets (`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`). No secrets are stored in the git tree.

---

## 5. Detailed Breakdown of Workflow Files

### 1. `ci.yml` — Automated Testing and Production Build
- **File Location**: [ci.yml](file:///.github/workflows/ci.yml)
- **Purpose**: Validates code quality on every push and PR before any container is built.
- **Jobs**:
  1. `backend-test`:
     - Sets up Python 3.11 with pip caching.
     - Installs dependencies from `backend/requirements.txt`.
     - Validates backend module imports (`python -c "import app.main"`).
     - Runs the comprehensive Pytest test suite (`backend/tests/`).
  2. `frontend-test-and-build`:
     - Sets up Node.js 20 with npm caching.
     - Runs clean dependency install (`npm ci`).
     - Executes React unit and component tests with Vitest (`npm test`).
     - Compiles the minified production bundle (`npm run build`).
     - Validates that `dist/index.html` and assets exist.
     - Uploads the production build artifact (`careon-frontend-dist`) with a 7-day retention period.

### 2. `docker.yml` — Multi-Container Build & Live Persistence Verification
- **File Location**: [docker.yml](file:///.github/workflows/docker.yml)
- **Purpose**: Verifies that the multi-container Docker architecture builds, starts, communicates, and persists clinical records.
- **Job**: `docker-validation`:
  1. Checks out repository and configures Docker Buildx.
  2. Runs `docker compose build --progress=plain` to build backend and frontend images.
  3. Inspects built images with `docker images | grep careon`.
  4. Starts the stack in detached mode: `docker compose up -d`.
  5. Polls container health status via `docker inspect` until both services report `healthy`.
  6. Verifies direct backend access (`http://localhost:8000/api/health`).
  7. Verifies frontend web delivery and Nginx reverse proxying (`http://localhost:3000/api/health`).
  8. Dispatches an automated test emergency via HTTP POST to `/api/emergencies` and records the resulting `id`.
  9. **Destructive container restart**: Executes `docker compose down` followed by `docker compose up -d`.
  10. Asserts via curl that the created emergency record still exists in the database.
  11. Outputs container logs (`docker compose logs`) for audit trails.
  12. Cleans up runner containers.

### 3. `deploy.yml` — Automated Deployment and Release Readiness
- **File Location**: [deploy.yml](file:///.github/workflows/deploy.yml)
- **Purpose**: Implements a zero-downtime deployment pipeline to remote servers when credentials are configured, or produces an automated deployment-readiness audit report when running in non-production environments.
- **Jobs**:
  1. `verify-and-package`:
     - Builds production images tagged with Git commit SHA and `latest`.
     - Produces a machine-readable `release-manifest.json` containing release version, commit hash, build timestamp, volume mappings, and exposed ports.
     - Uploads the release manifest artifact.
  2. `deploy`:
     - Inspects GitHub Secrets for `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY`.
     - **If configured**: Sets up SSH keys, securely transfers `docker-compose.yml` to the production server via SCP, and runs zero-downtime container updates (`docker compose pull && docker compose up -d --remove-orphans`).
     - **If secrets not yet configured (e.g., initial local repository)**: Executes an automated deployment-readiness audit validating image manifests, environment security, and volume bindings, while providing explicit instructions on connecting a server without pretending a remote deployment occurred.

---

## 6. Docker Containerization Concepts

### What is Docker?
Docker is an open-source containerization platform that packages an application and all its dependencies, system libraries, configuration files, and runtimes into a standardized unit called a container. This ensures that the application runs identically on a developer's laptop, in GitHub Actions CI, and on a production cloud server ("build once, run anywhere").

### Difference Between a Docker Image and a Docker Container
Understanding the distinction between an image and a container is fundamental:

| Concept | Docker Image | Docker Container |
|---|---|---|
| **Analogy** | Blueprint, recipe, or frozen snapshot | Living house, prepared meal, or running process |
| **State** | **Immutable & Read-Only**: Once built, an image never changes. | **Mutable & Stateful**: A living instance with an ephemeral read-write layer. |
| **Contents** | Application code, OS libraries, packages, environment definitions. | An active Linux process running the image instructions in isolated namespaces. |
| **Storage** | Stored on disk in the Docker image cache or a container registry (e.g., Docker Hub). | Consumes CPU, RAM, and network I/O while running; stopped or deleted when terminated. |
| **Command** | `docker images`, `docker build`, `docker pull` | `docker ps`, `docker run`, `docker stop`, `docker rm` |

> **Simple Explanation**:  
> A **Docker Image** is like an operating system installer ISO or an executable program file on your hard drive — it sits passively on disk.  
> A **Docker Container** is what happens when you run that executable — it becomes an active, isolated process executing in computer memory. You can run ten containers from a single image simultaneously.

---

## 7. CareOn Docker Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │                   HOST MACHINE                         │
                  │                                                        │
                  │   Browser / Client ───▶ Host Port 3000                 │
                  │   Direct API Calls ───▶ Host Port 8000                 │
                  └──────────────┬────────────────────────┬────────────────┘
                                 │                        │
                    ┌────────────▼──────────┐ ┌───────────▼───────────┐
                    │  careon-frontend      │ │  careon-backend       │
                    │  (Port 80 internally) │ │  (Port 8000)          │
                    │  Nginx Web Server     │ │  FastAPI + Uvicorn    │
                    │  React Production App │ │  Python 3.11 Runtime  │
                    └────────────┬──────────┘ └───────────▲───────────┘
                                 │                        │
                                 │   Docker Bridge Network│
                                 └─── (careon-net) ───────┘
                                 Reverse Proxy: /api/* ──▶ backend:8000
                                                          │
                                             ┌────────────▼───────────┐
                                             │ Persistent Volume      │
                                             │ (careon_data -> /data) │
                                             │ SQLite: careon.db      │
                                             └────────────────────────┘
```

### 1. Backend Container (`careon-backend`)
- **Base Image**: `python:3.11-slim` (minimal attack surface, optimized Linux runtime).
- **Service**: FastAPI ASGI application served by Uvicorn.
- **Port**: Exposed on port `8000`.
- **Database Engine**: SQLAlchemy connecting to `sqlite:////data/careon.db`.
- **Healthcheck**: Periodically probes `http://localhost:8000/api/health` every 10 seconds.
- **Persistence**: Mounts the named Docker volume `careon_data` at `/data`.

### 2. Frontend Container (`careon-frontend`)
- **Multi-Stage Build**:
  - *Stage 1 (Builder)*: `node:20-alpine` runs `npm ci` and `npm run build` to compile the React code into optimized HTML, CSS, and JS bundles.
  - *Stage 2 (Runtime)*: `nginx:alpine` serves static assets and provides an embedded reverse proxy.
- **Port**: Exposed to the host on port `3000` (mapping to Nginx port `80`).
- **Reverse Proxy**: Nginx proxies incoming `/api/*` requests internally to `http://backend:8000/api/*` using Docker internal DNS.
- **Healthcheck**: Periodically probes `http://127.0.0.1/nginx-health`.

### 3. Docker Volume & Persistence Design
- In containerized environments, container storage is ephemeral by default; if a container is removed, all newly created files inside it disappear.
- To prevent loss of hospital emergency alerts, CareOn maps a named volume `careon_data` to `/data` in the backend container.
- When `docker compose down` is run, the containers and networks are deleted, but the named volume `careon_data` remains on the host. When `docker compose up -d` is run again, the backend container mounts the existing volume and immediately finds `careon.db` with all previous records intact.

---

## 8. Exact Commands for Container Operations

All commands must be executed from the root of the CareOn project directory:

### 1. Building Docker Images
Builds both the backend and frontend Docker images from their respective Dockerfiles:
```bash
docker compose build
```
*To force a clean build without cache:*
```bash
docker compose build --no-cache
```

### 2. Listing Docker Images
Displays all local Docker images along with their IDs, creation time, and disk footprint:
```bash
docker images | grep careon
```
*Expected output:*
```
careon-backend    latest   be71dcc653d1   473MB
careon-frontend   latest   36cedcf60ab4   93.5MB
```

### 3. Starting Containers
Launches the backend and frontend services in the background (detached mode):
```bash
docker compose up -d
```

### 4. Listing Running Containers
Checks the operational status, ports, uptime, and health state of CareOn containers:
```bash
docker compose ps
```
*Expected output:*
```
NAME              IMAGE                    STATUS                   PORTS
careon-backend    careon-backend:latest    Up 2 minutes (healthy)   0.0.0.0:8000->8000/tcp
careon-frontend   careon-frontend:latest   Up 2 minutes (healthy)   0.0.0.0:3000->80/tcp
```

### 5. Viewing Container Logs
Streams live, timestamped logs from both services:
```bash
docker compose logs -f
```
*To inspect a single service (e.g., backend only, last 100 lines):*
```bash
docker compose logs --tail=100 -f backend
```
*To inspect frontend Nginx web traffic:*
```bash
docker compose logs --tail=100 -f frontend
```

### 6. Accessing the CareOn Application
Once the containers are running, access the interfaces:
- **CareOn Web Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Direct Healthcheck**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Interactive Swagger API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Nginx Swagger Proxy**: [http://localhost:3000/docs](http://localhost:3000/docs)

### 7. Stopping Containers
Stops and removes the running containers and internal network, while leaving the data volume untouched:
```bash
docker compose down
```

### 8. Restarting Containers
Restarts both containers safely:
```bash
docker compose restart
```
*Or, to perform a full teardown and recreate:*
```bash
docker compose down
docker compose up -d
```

### 9. Verifying Database Persistence Across Restarts
To mathematically prove that data survives container recreation:

1. **Submit a test emergency** while the application is running:
   ```bash
   curl -s -X POST http://localhost:8000/api/emergencies \
     -H "Content-Type: application/json" \
     -d '{
       "patient_name": "Faculty Verification Subject",
       "room_number": "ICU-DEMO-99",
       "emergency_type": "Cardiac",
       "priority": "Critical",
       "description": "Verification of persistent SQLite storage volume across container teardown"
     }'
   ```
   *Note the returned `"id"` (e.g. `id: 5`).*

2. **Tear down the containers completely**:
   ```bash
   docker compose down
   ```
   *(Both `careon-backend` and `careon-frontend` containers are completely removed).*

3. **Start the containers again**:
   ```bash
   docker compose up -d
   ```

4. **Query the previously submitted record**:
   ```bash
   curl -s http://localhost:8000/api/emergencies/5
   ```
   *The JSON object for `Faculty Verification Subject` is returned identically, proving persistence!*

5. **Verify on the Web Dashboard**:  
   Open [http://localhost:3000](http://localhost:3000) in your browser. The emergency card for `Faculty Verification Subject` remains displayed on the emergency dispatch board.

---

## 9. How the Deployment Process Works

CareOn provides a dual-mode deployment strategy implemented in `.github/workflows/deploy.yml`:

### Automated Cloud Deployment (When Secrets Configured)
To deploy CareOn to a cloud virtual machine (e.g., AWS EC2, DigitalOcean Droplet, Hetzner Cloud, or on-premises server):

1. **Configure Target Host**:
   Ensure Docker and Docker Compose are installed on the target Linux server:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo mkdir -p /opt/careon
   ```
2. **Add Repository Secrets** in GitHub (**Settings → Secrets and variables → Actions**):
   - `DEPLOY_HOST`: Public IP address or DNS hostname of your server.
   - `DEPLOY_USER`: SSH login username (e.g. `ubuntu` or `root`).
   - `DEPLOY_SSH_KEY`: Private SSH Key matching the public key in `~/.ssh/authorized_keys` on the server.
3. **Trigger Pipeline**:
   Push to `main` or trigger the **CareOn Deployment & Release Readiness** workflow manually.
4. **Execution**:
   The workflow connects securely over SSH, synchronizes `docker-compose.yml`, builds/pulls images, executes `docker compose up -d --remove-orphans`, and runs health checks.

### Automated Deployment-Readiness Audit (When Running Locally or Without Secrets)
If remote secrets are not yet configured, the pipeline does not falsely report that the system has been deployed to the cloud. Instead:
- It builds and tags production images with the Git commit SHA.
- It outputs a signed `release-manifest.json` artifact.
- It executes an automated deployment-readiness audit validating image integrity, network boundaries, and volume mounts.
- It outputs instructions on how to activate live deployment via GitHub Secrets.

---

## 10. Step-by-Step Faculty Demonstration Walkthrough

Follow this 13-step sequence during the CDD evaluation demonstration:

```
┌────────────────────────────────────────────────────────────────────────┐
│             FACULTY DEMONSTRATION WORKFLOW CHECKLIST                   │
├────────────────────────────────────────────────────────────────────────┤
│ [ ] Step 1: Open the CareOn GitHub repository.                         │
│ [ ] Step 2: Make a small code change (e.g. in README or a comment).    │
│ [ ] Step 3: Commit and push the change to GitHub:                      │
│             git add . && git commit -m "demo: trigger CI" && git push  │
│ [ ] Step 4: Open the 'Actions' tab on GitHub.                          │
│ [ ] Step 5: Show the workflow running automatically on the push event. │
│ [ ] Step 6: Expand 'CareOn CI Pipeline' -> Show backend tests passing. │
│ [ ] Step 7: Expand frontend job -> Show React production build passing.│
│ [ ] Step 8: Show Docker build & validation workflow executing.         │
│ [ ] Step 9: Show final green checkmarks for all pipeline stages.       │
│ [ ] Step 10: In terminal, run: docker compose up -d                   │
│ [ ] Step 11: Run docker compose ps -> Show both containers healthy.    │
│ [ ] Step 12: Open http://localhost:3000 -> Submit a new emergency.    │
│ [ ] Step 13: Run docker compose down && docker compose up -d           │
│              Refresh browser -> Demonstrate record persistence!        │
└────────────────────────────────────────────────────────────────────────┘
```

### Collecting Evidence Screenshots
To prepare evaluation reports or presentation slides, capture screenshots of:
1. **GitHub Actions Overview**: The list of workflow runs showing green checkmarks for `ci.yml`, `docker.yml`, and `deploy.yml`.
2. **Backend Pytest Output**: The expanded step showing `15 passed in 0.10s`.
3. **Frontend Build Output**: The step showing `vite build` completed and `dist/index.html` created.
4. **Docker Images List**: Terminal screenshot of `docker images | grep careon`.
5. **Running Containers**: Terminal screenshot of `docker compose ps` displaying `careon-backend` and `careon-frontend` as `(healthy)`.
6. **CareOn Live Web Application**: Browser screenshot of `http://localhost:3000` showing the emergency dispatch form and incident cards.
7. **Database Persistence Verification**: Terminal screenshot showing `docker compose down`, followed by `docker compose up -d`, and curl returning the created patient record.

---

## 11. Known Limitations & Production Hardening

In strict accordance with the CDD requirements, the following technical limitations and production considerations are explicitly documented:

1. **Single-Node Storage**: The SQLite database uses a Docker local volume (`careon_data`). While persistent across container restarts on a single host, enterprise multi-node clustering (Kubernetes / Docker Swarm) would require an external relational database (e.g., PostgreSQL / Amazon RDS) with automated connection pooling.
2. **SSL / HTTPS Termination**: For local demonstration, the Nginx container serves unencrypted HTTP on port `3000`. In a production cloud deployment, Nginx should be configured with Let's Encrypt SSL certificates (Certbot) or placed behind an AWS Application Load Balancer / Cloudflare reverse proxy with HTTPS enforcement on port 443.
3. **Secret Store Integration**: The current configuration reads runtime variables from environment variables and GitHub Actions Secrets. An enterprise healthcare environment should integrate with HashiCorp Vault or AWS Secrets Manager for dynamic secret rotation.
