# CyberEats Frontend

Next.js App Router UI for the CyberEats cyberpunk food delivery marketplace.

## Prerequisites

- Node.js 20+
- Backend API running on port 4000 (optional for Day 1 shell)

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright smoke tests |

## Structure

```
app/                 # Next.js routes (App Router)
components/ui/       # Shadcn-style UI primitives
features/            # Feature modules (Day 2+)
providers/           # React Query + theme
services/api.ts      # Axios client
styles/globals.css   # Cyberpunk theme tokens
tests/e2e/           # Playwright tests
```

## Theme

- Background: `#0a0e17`
- Surface: `#111827`
- Accent: `#00d4ff` (neon cyan)
- Dark mode forced via `ThemeProvider`

## Environment

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api/v1` |
