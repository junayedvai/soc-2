# AegisX – Unified AI‑Augmented SOC Command Center

Enterprise-style demo platform showing **SIEM → Incident → SOAR → Compliance → Executive** workflows with **AI-assisted narratives**, **RBAC**, and **multi-tenant** state.

## Quick start

### 1) Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

### 2) Frontend (Next.js 14 App Router)

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

The frontend rewrites `/api/*` to the FastAPI backend (defaults to `http://127.0.0.1:8000`). You can override via:

```bash
export NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

## Key demo flows

- **Alerts module**: acknowledge/assign/escalate/create-case updates global KPIs.
- **Incidents module**: playbook stages + simulated SOAR actions (block IP, disable user, quarantine host).
- **AI Log Analysis**: paste or upload logs → `/api/logs/parse` → `/api/alerts/generate` (fallback to mock if backend offline).
- **Compliance**: framework tabs (Basel III / IFRS 9 / ESG), evidence checklist, AI narrative.
- **Executive**: board-ready KPI cards + trend chart + mock report export.

## Architecture notes

- Frontend state uses **Zustand** and is **tenant-scoped** (`tenantId`).
- RBAC is enforced in the UI (sidebar + modules) via a role map.
- Backend uses a **modular service-layer** and **in-memory store**.

## Folder structure (high level)

```
aegisx/
  backend/
    app/
      api/routes/
      services/
      models.py
      store.py
      main.py
  frontend/
    src/
      app/(console)/
      components/
      store/
      types/
      mock/
```



![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-01%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-08%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-16%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-25%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-32%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-43%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-50%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-33-56%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-34-02%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-34-09%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-34-15%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-34-54%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)

![image alt](https://github.com/junayedvai/soc-2/blob/main/Screenshot%202026-02-26%20at%2007-35-14%20AegisX%20%E2%80%93%20Unified%20AI-Augmented%20SOC%20Command%20Center.png)
