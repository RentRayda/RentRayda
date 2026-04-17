# Dev environment verified — 2026-04-17

## Goal
Verify local dev environment end-to-end: install, typecheck, build, API boots, mobile compiles.

## Versions
- Node: v24.14.1
- pnpm: 10.33.0
- PostgreSQL: 16.13 (Docker container `rentrayda-postgres`)
- Redis: 7 (Docker container `rentrayda-redis`)
- Turbo: 2.9.4
- Next.js: 16.2.2

## Results

| Step | Check | Result |
|------|-------|--------|
| 1 | Node >= v22 | v24.14.1 PASS |
| 2 | pnpm >= 10 | 10.33.0 PASS |
| 3 | Postgres available | 16.13 via Docker PASS |
| 4 | Redis PONG | PONG via Docker PASS |
| 5 | .env exists | Yes, 767 bytes PASS |
| 6 | .env vars match .env.example | No diff PASS |
| 7 | pnpm install | Done in 20.9s, zero errors PASS |
| 8 | Workspace packages linked | All 6: api, db, mobile, shared, ui, web PASS |
| 9 | Migrations applied | drizzle-kit migrate successful PASS |
| 10 | 9 tables exist | All 9 confirmed PASS |
| 11 | turbo typecheck | 8 tasks successful, 0 errors PASS |
| 12 | turbo build | 6 tasks successful, 0 errors PASS |
| 13 | API health check | {"status":"ok"} at /api/health PASS |
| 14 | API stopped | Clean stop PASS |
| 15 | Mobile typecheck | Zero errors PASS |

## Notes for future sessions

- Postgres and Redis run via Docker, not native install. No `psql` or `redis-cli` on host PATH.
  - Use `docker exec rentrayda-postgres psql ...` and `docker exec rentrayda-redis redis-cli ...`
- drizzle-kit migrate needs DATABASE_URL env var loaded manually when run from packages/db:
  `export $(grep -v '^#' ../../.env | grep DATABASE_URL | xargs) && npx drizzle-kit migrate`
  Alternatively: `cd packages/db && npx drizzle-kit migrate` with env sourced from root.
- API health endpoint is `/api/health` not `/health`
- Workspace packages use pnpm `link:` protocol with `node-linker=hoisted` — they won't appear in `node_modules/@rentrayda/`
- Next.js warns about workspace root detection (non-blocking)

## Time spent
~20 minutes
