# Interactive Diagram/Graph Editor with Persistence

Full-stack app for creating and editing diagrams with node/edge graph state persisted in PostgreSQL.

## Tech Stack

- Frontend: React (Hooks), JavaScript, Axios, ReactFlow
- Backend: Node.js + Express
- Database: PostgreSQL

## Project Structure

```text
graph_app/
  backend/                # Express API + DB access + tests
  frontend/               # ReactFlow editor app
  scripts/                # PowerShell helpers
  ARCHITECTURE.md
  README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- Local PostgreSQL server

## Setup

1. Create databases:

```sql
CREATE DATABASE graph_app;
CREATE DATABASE graph_app_test;
```

2. Run setup script:

```powershell
.\scripts\setup.ps1
```

3. Update env files if needed:

- `backend/.env`
- `backend/.env.test`
- `frontend/.env`

## Run

Run DB migration:

```powershell
.\scripts\migrate.ps1
```

Start backend:

```powershell
.\scripts\run_backend.ps1
```

Start frontend:

```powershell
.\scripts\run_frontend.ps1
```

Or run both:

```powershell
npm run dev
```

Frontend URL: `http://localhost:5173`  
Backend URL: `http://localhost:4000`

## API

Base path: `/api/diagrams`

- `POST /` create diagram `{ title, graph_json }`
- `GET /` list diagrams metadata
- `GET /:id` get diagram by id
- `PUT /:id` update title and/or graph_json
- `DELETE /:id` delete diagram

`graph_json` stores:

- `nodes`
- `edges`
- `viewport` (`x`, `y`, `zoom`)

## Tests

Run backend CRUD API tests:

```powershell
.\scripts\test_backend.ps1
```

or

```powershell
npm test
```

## Implemented Features

- Create new blank diagram
- Toolbar with node types: generic, EC2, VPC, DB
- Add nodes and drag/drop positioning
- Directional edge connect (source -> target)
- Double-click node to edit label
- Right-click node/edge context menu delete
- Save diagram to PostgreSQL
- Load diagram from saved list
- Update existing diagram
- Diagram list metadata (`id`, `title`, `updated_at`)
