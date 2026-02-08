# Architecture

## High-Level Flow

1. User interacts with ReactFlow editor in `frontend`.
2. Frontend keeps graph state in-memory (`nodes`, `edges`, `viewport`).
3. Axios sends CRUD requests to Node/Express backend.
4. Backend validates payloads with Zod.
5. Backend stores/retrieves graph JSON from PostgreSQL (`diagrams.graph_json`).
6. Frontend renders loaded graph state and restores viewport zoom/pan.

## Components

### Frontend (`frontend/`)

- `src/pages/EditorPage.jsx`: main graph editor and save/load workflow
- `src/components/Toolbar.jsx`: new diagram, add node type, save
- `src/components/DiagramList.jsx`: saved diagrams list and metadata
- `src/components/ContextMenu.jsx`: right-click delete menu
- `src/components/CloudNode.jsx`: custom node UI for generic/EC2/VPC/DB
- `src/api/diagrams.js`: CRUD API client

### Backend (`backend/`)

- `src/app.js`: Express app, CORS, security headers, error handling
- `src/routes/diagramRoutes.js`: REST routes
- `src/controllers/diagramController.js`: request/response handling
- `src/services/diagramService.js`: SQL data access
- `src/validation/diagramSchema.js`: Zod payload validation
- `src/db/migrate.js`: migration runner
- `migrations/001_create_diagrams.sql`: schema setup
- `tests/diagrams.test.js`: CRUD API integration tests

## Data Model

### `diagrams`

- `id BIGSERIAL PRIMARY KEY`
- `title TEXT NOT NULL`
- `graph_json JSONB NOT NULL` (`nodes`, `edges`, `viewport`)
- `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

Trigger updates `updated_at` automatically on row updates.

## API Contract

- `POST /api/diagrams` create
- `GET /api/diagrams` list metadata
- `GET /api/diagrams/:id` fetch full diagram
- `PUT /api/diagrams/:id` update full/partial
- `DELETE /api/diagrams/:id` delete

## Error Handling

- Validation errors: `400` with issue details
- Not found: `404`
- Invalid IDs: `400`
- Unexpected server/database errors: `500`
