# Polymarket — Prediction Market Platform

A full-stack, Web3-native prediction market platform where users can trade binary outcome contracts (*Yes* / *No*) on real-world events. Built as a Turborepo monorepo powered by Bun.

---

## Overview

Polymarket lets authenticated users:

- Browse and create prediction markets
- Buy or sell **Yes** / **No** position contracts priced between 0–100¢
- **Split** USD into equal Yes + No shares (guaranteed to sum to $1)
- **Merge** matching Yes + No shares back into USD
- Deposit (on-ramp) and withdraw (off-ramp) USD balance
- Track their open positions, order history, and portfolio

Prices are driven entirely by an on-chain-style central limit order book (CLOB) stored per market. When a buy order cannot be fully filled from existing opposing orders, the remainder is queued in the orderbook at the requested price.

---

## Repository Structure

```
polymarket/
├── apps/
│   ├── backend/          # Express REST API + CLOB matching engine
│   └── frontend/         # React + Vite SPA
└── packages/
    ├── db/               # Prisma schema, client & migrations
    ├── ui/               # Shared React component library
    ├── eslint-config/    # Shared ESLint configuration
    └── typescript-config/ # Shared tsconfig bases
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | [Turborepo](https://turbo.build/) + [Bun](https://bun.sh/) workspaces |
| **Frontend** | React 19, Vite, TypeScript, TailwindCSS v4 |
| **UI Components** | Radix UI primitives, Framer Motion, Lucide icons |
| **Data Fetching** | TanStack Query (React Query v5) |
| **Routing** | React Router v7 |
| **Backend** | Node.js, Express v5, TypeScript |
| **Auth** | [Supabase Auth](https://supabase.com/docs/guides/auth) (JWT + wallet address via `user_metadata`) |
| **Database** | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| **Validation** | Zod |
| **Notifications** | Sonner |

---

## Data Models

```
User          — wallet address, USD balance (stored in cents)
Market        — title, description, resolution criteria, Yes/No orderbooks, total qty
Position      — userId × marketId × type (Yes | No), quantity held
OrderHistory  — audit log of every Buy / Sell / Split / Merge action
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/markets` | — | List all markets |
| `GET` | `/market?marketId=` | — | Get a single market |
| `POST` | `/market/create` | ✅ | Create a new prediction market |
| `POST` | `/order` | ✅ | Place a buy or sell order (CLOB matching) |
| `POST` | `/split` | ✅ | Convert USD → equal Yes + No shares |
| `POST` | `/merge` | ✅ | Convert equal Yes + No shares → USD |
| `GET` | `/balance` | ✅ | Get authenticated user's USD balance |
| `GET` | `/positions` | ✅ | Get authenticated user's open positions |
| `POST` | `/history` | ✅ | Get authenticated user's order history |
| `POST` | `/onramp` | ✅ | Deposit USD into account |
| `POST` | `/offramp` | ✅ | Withdraw USD from account |

Authenticated routes require a `Authorization: Bearer <supabase-jwt>` header. The middleware resolves the wallet address from the JWT's `user_metadata` and auto-creates the user record on first access.

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing / hero page |
| `/markets` | Markets | Browse all active prediction markets |
| `/markets/:id` | Market Detail | View orderbook, place orders, split/merge |
| `/dashboard` | Dashboard | Personal positions and portfolio summary |
| `/profile` | Profile | Account settings and balance |
| `/how-it-works` | How It Works | Platform explainer |

---

## Prerequisites

- **Bun** ≥ 1.3  (`npm install -g bun`)
- **Node.js** ≥ 18
- **PostgreSQL** database (or a Supabase project — the DB URL is used directly)
- A **Supabase** project for authentication

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/polymarket.git
cd polymarket
bun install
```

### 2. Configure Environment Variables

**`packages/db/.env`**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**`apps/backend/.env`**
```env
SUPABASE_SECRET_KEY="your-supabase-service-role-key"
```

**`apps/frontend/.env`**
```env
VITE_BACKEND_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Run Database Migrations

```bash
cd packages/db
bunx prisma migrate deploy
bunx prisma generate
```

### 4. Start Development Servers

From the repo root, start all apps simultaneously:

```bash
bun dev
```

Or start individual apps:

```bash
# Backend only (http://localhost:3000)
bun dev --filter=backend

# Frontend only (http://localhost:5173)
bun dev --filter=frontend
```

---

## Building for Production

```bash
bun run build
```

This runs `turbo build` across all packages and apps in the correct dependency order.

---

## Order Matching Logic

The backend implements a **price-time priority CLOB**:

1. On a **buy** order for Yes @ price `P`:
   - Matches against existing Yes sell orders ≤ `P`, reducing their position and crediting their USD.
   - Unfilled quantity is entered as a reverse (synthetic) No sell order at price `100 − P` in the No orderbook, enabling cross-side liquidity.

2. On a **sell** order for Yes @ price `P`:
   - Matches against No sell orders at price ≤ `100 − P`.
   - Unfilled quantity is queued in the Yes orderbook.

3. **Split**: Atomically debits `amount` USD and credits `amount` Yes + `amount` No shares. Always guaranteed at zero slippage.

4. **Merge**: Inverse of split — burns equal Yes + No shares and credits USD.

All order operations use PostgreSQL `SELECT … FOR UPDATE` row-level locking inside a transaction to prevent race conditions.
