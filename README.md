# Paper Trader

Professional **paper trading** web app for memecoins.  
This platform **simulates** trades using live market data. It does **not** execute blockchain transactions.

## Stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **API:** REST

## Project structure

```text
Papertrade/
├── frontend/          # Next.js UI
│   ├── app/           # Routes & layouts
│   ├── components/    # Layout + UI library
│   ├── hooks/
│   ├── lib/
│   ├── services/      # API clients
│   ├── styles/
│   └── types/
└── backend/           # FastAPI service
    ├── api/           # App factory
    ├── database/      # Engine / sessions
    ├── models/        # ORM models (future)
    ├── routes/        # HTTP routers
    ├── services/      # Business logic
    └── utils/         # Config & helpers
```

## Prerequisites

- Node.js 20+
- Python 3.12+
- Git

## Setup

### 1. Backend

```bash
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\activate          # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
copy .env.example .env            # Windows
# cp .env.example .env            # macOS / Linux
```

Run the API:

```bash
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

- Health: http://127.0.0.1:8000/api/health  
- Docs: http://127.0.0.1:8000/docs  

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local      # Windows
# cp .env.example .env.local      # macOS / Linux
npm run dev
```

Open http://localhost:3000 — redirects to the Dashboard.

## Available pages

| Route | Page |
|-------|------|
| `/dashboard` | Dashboard |
| `/portfolio` | Portfolio |
| `/history` | Trade History |
| `/settings` | Settings |

Trading features are intentionally not implemented yet. This commit is foundation + UI shell only.

## Scripts

**Frontend**

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

**Backend**

- `uvicorn api.main:app --reload` — local API with hot reload

## Environment

**Frontend** (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_APP_ENV=development
```

**Backend** (`backend/.env`)

```env
APP_NAME=Paper Trader API
APP_ENV=development
API_PREFIX=/api
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///./paper_trader.db
```

## Architecture notes

- UI never talks to the database directly — only via REST (`services/`).
- Backend keeps HTTP (`routes/`) separate from domain logic (`services/`) and persistence (`database/`, `models/`).
- SQLite is temporary; switch `DATABASE_URL` when migrating.
