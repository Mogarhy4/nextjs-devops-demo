# Next.js Enterprise DevOps & Kubernetes Pipeline

A production-ready, highly resilient, and fully automated microservices architecture. This project showcases a modern **Next.js** web application securely connected to a **PostgreSQL** database, orchestrated locally via **Kubernetes (Minikube)**, and delivered through a cloud-hosted **CI/CD Pipeline (GitHub Actions)**.

This repository is designed to demonstrate how to bridge the gap between frontend development and modern cloud infrastructure, emphasizing containerization, persistent storage, secrets management, and automated quality gates.

---

## 🏗️ System Architecture

The following diagram illustrates how traffic flows and how components interact securely within our local Kubernetes cluster:

```text
                  [ Browser (Your Laptop) ]
                             │
                             ▼ (Minikube Service Tunnel)
               ┌───────────────────────────┐
               │    nextjs-web-service     │ (Internal Router / Port: 3000)
               └─────────────┬─────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │   nextjs-web-deployment   │ (Frontend Pods)
               │  - Reads DB Credentials   │
               │    from secure Secret     │
               └─────────────┬─────────────┘
                             │
                             ▼ (Internal DNS lookup: postgres-service)
               ┌───────────────────────────┐
               │     postgres-service      │ (Internal Router / Port: 5432)
               └─────────────┬─────────────┘
                             │
                             ▼
               ┌───────────────────────────┐
               │    postgres-deployment    │ (Database Pod)
               │  - Reads Password Secret  │
               │  - Mounts Persistent Vol. │
               └─────────────┬─────────────┘
                             │
                             ▼ (Crash-Resilient Storage)
               ┌───────────────────────────┐
               │    Persistent Volume      │ (Your Laptop Hard Drive / HostPath)
               └───────────────────────────┘
```

---

## 🌟 Key Engineering Highlights

### 📦 1. Containerization (Docker)
* **Multi-stage Builds:** The `Dockerfile` uses a multi-stage approach to minimize the production image footprint and speed up delivery.
* **Hermetic Environments:** The entire system runs inside isolated runtimes, guaranteeing identical execution on local development setups and cloud production nodes.

### ☸️ 2. Resilient Orchestration (Kubernetes)
* **High Availability & Self-Healing:** Configured via Deployment manifests. If a node or pod crashes, Kubernetes instantly provisions a replacement within seconds.
* **Persistent Storage (PV/PVC):** Utilizes a dedicated `PersistentVolumeClaim` binding to the host machine. If the database container restarts or fails, your live data remains completely untouched and safely stored on your local disk.
* **Internal DNS Resolution:** Service discovery handles secure, internal communication between the web frontend and backend database using standard K8s DNS naming (`postgres-service`).

### 🔒 3. Enterprise Security & Secret Management
* **Decoupled Credentials:** Database usernames and passwords are **never** hardcoded. They are fully managed through Kubernetes `Secret` memory objects.
* **Secure Environment Injection:** Credentials are obfuscated via Base64 and dynamically injected into the running Next.js container environment variables at runtime.

### 🚀 4. Cloud-Based CI/CD Automation (GitHub Actions)
* **Quality Gates:** Every `git push` triggers an isolated, cloud-hosted **Ubuntu virtual environment**.
* **Automated Builds & Sanity Checks:** The pipeline provisions Node.js, installs dependencies, builds the Next.js production bundle, compiles the Docker image, and validates configuration schemas. If any developer breaks a feature, the build fails instantly, protecting production.

---

## 🛠️ File Structure

```text
nextjs-devops-demo/
├── .github/
│    └── workflows/
│         └── ci-cd.yml          # GitHub Actions CI/CD Pipeline
├── src/                          # Next.js Application Source Code
├── Dockerfile                    # Multi-stage Docker Container Configuration
├── postgres-secret.yaml          # Encrypted Database Credentials (K8s Secrets)
├── postgres-db.yaml              # PostgreSQL PV, PVC, Service, & Deployment
├── deployment.yaml               # Next.js Web Deployment
└── service.yaml                  # Next.js External Service Router
```

---

## 🚀 Step-by-Step Local Deployment Guide

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Node.js 20+](https://nodejs.org/)

---

### Step 1: Start Your Kubernetes Cluster
Spin up your local Kubernetes virtual machine:
```bash
minikube start
```

---

### Step 2: Deploy Secrets and Database
Apply the secure credentials first, followed by the database infrastructure:
```bash
# 1. Create the secure database secrets
kubectl apply -f postgres-secret.yaml

# 2. Deploy the PostgreSQL Storage and Deployment
kubectl apply -f postgres-db.yaml
```

**Verify the database status:**
```bash
kubectl get pods -l app=postgres
```

---

### Step 3: Deploy the Next.js Web Application
Deploy the frontend container and its routing service:
```bash
# 1. Apply the Next.js Web deployment
kubectl apply -f deployment.yaml

# 2. Apply the routing service
kubectl apply -f service.yaml
```

**Verify all pods are running successfully:**
```bash
kubectl get pods
```

---

### Step 4: Access the Live Application
Minikube runs inside an isolated network. To open up a secure tunnel from your browser to your new Kubernetes cluster, run:
```bash
minikube service nextjs-web-service
```
This will automatically spin up a tab in your default browser pointing to your production-ready, self-healing Next.js application!

---

## 🧪 DevOps Troubleshooting & Real-World Lessons Learned

### Debugging the Pipeline (Node.js Version Mismatch)
* **The Problem:** The initial GitHub Actions CI run failed during the Next.js build phase. Next.js required `Node.js >= 20.9.0`, but the workflow environment was initially configured to pull `Node.js 18`.
* **The Fix:** Troubleshooted the runner console logs, isolated the syntax schema mismatch, and updated `.github/workflows/ci-cd.yml` to set `node-version: '20'`. This resolved the build error and unlocked a passing pipeline.
* **Key Takeaway:** This demonstrated the critical importance of a **CI/CD Quality Gate** in keeping broken runtime targets from entering the repository.
