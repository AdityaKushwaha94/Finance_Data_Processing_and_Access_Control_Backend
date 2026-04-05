# Finance Dashboard Backend

A TypeScript + Node.js + Express + MongoDB backend for a finance dashboard system.

This project demonstrates:

- Role-based access control (Viewer, Analyst, Admin)
- User management with active/inactive status
- Financial record CRUD with filters
- Dashboard summary and analytics APIs
- Validation and structured error handling
- Layered architecture with SOLID-friendly separation

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB (local)
- Mongoose
- Zod (request validation)
- JWT (authentication)

## Roles and Access Model

| Role | Permissions |
| --- | --- |
| viewer | Can access dashboard overview only |
| analyst | Can read financial records + dashboard overview |
| admin | Full access: users, records, dashboard |

## Project Structure

```
src/
	config/         # env and DB setup
	constants/      # role constants
	controllers/    # HTTP layer (thin)
	middlewares/    # auth, authorize, validate, error handlers
	models/         # mongoose schemas
	repositories/   # data access abstraction + implementations
	routes/         # express routes
	services/       # business logic
	types/          # shared TS types + express request extension
	utils/          # helpers and mapping utilities
	validators/     # zod schemas
```

## SOLID Principles Applied

- Single Responsibility:
	- Controllers only handle HTTP request/response.
	- Services contain business rules.
	- Repositories handle persistence.
- Open/Closed:
	- Route-level permissions can be extended without changing core service logic.
- Liskov Substitution:
	- Services depend on repository interfaces, not direct concrete assumptions.
- Interface Segregation:
	- Repository interfaces expose focused methods for each domain.
- Dependency Inversion:
	- Services and middleware consume abstractions (interfaces), composed in `src/container.ts`.

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally (default URI in env example)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Run production build:

```bash
npm start
```

## Environment Variables

Defined in `.env.example`:

- `PORT` - API port (default: `4000`)
- `MONGO_URI` - local Mongo URI
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - token lifetime
- `SEED_ADMIN_EMAIL` - default admin seed email
- `SEED_ADMIN_PASSWORD` - default admin seed password

## Authentication and Default Admin

- On server start, if no admin user exists, the app auto-creates one using:
	- `SEED_ADMIN_EMAIL`
	- `SEED_ADMIN_PASSWORD`
- Login via `POST /api/auth/login` to receive a Bearer token.

## API Endpoints

Base URL: `http://localhost:4000`

Health:

- `GET /health`

Auth:

- `POST /api/auth/register` (public, default role = viewer)
- `POST /api/auth/login` (public)
- `GET /api/auth/me` (authenticated)

Users (admin only):

- `POST /api/users`
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

Financial Records:

- `POST /api/records` (admin)
- `GET /api/records` (analyst, admin)
- `GET /api/records/:id` (analyst, admin)
- `PATCH /api/records/:id` (admin)
- `DELETE /api/records/:id` (admin)

Filtering supported on `GET /api/records`:

- `type=income|expense`
- `category=<text>`
- `startDate=<ISO date>`
- `endDate=<ISO date>`
- `page=<number>`
- `limit=<number>`

Dashboard:

- `GET /api/dashboard/overview` (viewer, analyst, admin)

Query options:

- `startDate=<ISO date>`
- `endDate=<ISO date>`
- `months=<1-24>`
- `recentLimit=<1-20>`

Overview response includes:

- total income
- total expenses
- net balance
- category totals
- monthly trends
- recent activity

## Example Login Request

```http
POST /api/auth/login
Content-Type: application/json

{
	"email": "admin@finance.local",
	"password": "Admin@12345"
}
```

## Error Response Format

```json
{
	"success": false,
	"message": "Human readable error",
	"details": {}
}
```

## Assumptions and Tradeoffs

- Authentication is JWT-based and stateless.
- Register endpoint is open and creates Viewer users for quick local testing.
- MongoDB local instance is used for simplicity.
- No refresh-token flow included (kept intentionally minimal for assignment scope).
- No test suite added yet, but architecture supports adding unit/integration tests cleanly.
