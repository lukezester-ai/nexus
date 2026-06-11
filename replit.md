# Nexus Intelligence Group
Enterprise Intelligence Operating System

## Architecture (The Palantir Approach)

### 1. Nexus Core (The Internal Foundation)
The central intelligence and data infrastructure powering all applications.
- **Data Cloud**: The central data layer (Neo4j, Postgres, Qdrant).
- **Decision Engine**: The reasoning layer that proposes actions.
- **Audit Engine**: The trust layer that validates decisions (Risk, Compliance, Source).
- **Strategy Engine**: The forecasting and ROI layer (future Nexus Capital core).

### 2. Applications (The Client-Facing Layer)
Built on top of Nexus Core.
- **TerraIQ**: Operations / Intelligence. The operational brain.
- **Agrinexus Law**: Legal Layer. Contract intelligence and compliance.
- **FieldLot**: Marketplace / Execution. Trading and procurement.

### 3. Future SaaS Spin-offs
Once the ecosystem matures and acquires clients, internal Core components can be spun off as independent products:
- **Nexus Capital** (from Strategy Engine/Core)
- **Nexus Data Cloud** (from Data Cloud/Core)

## Run & Operate
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/nexus run dev` — run the Frontend server
- Required env: `DATABASE_URL` — Postgres connection string

## Decision Workflow
`Agent (App)` -> `Decision Engine (Core)` -> `Audit Engine (Core)` -> `Executive Approval`
