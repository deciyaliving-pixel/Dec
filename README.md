# StayKhoj

An India-focused travel journal and destination-discovery site: field notes, seasonal
planning, regional route guides, food trails, and a visual destination map — built to
help readers decide where to go, when to go, and how to travel a little more
thoughtfully.

## Brand system: "Monsoon Postcard"

Warm paper surfaces, ink-navy typography, vermilion accents used sparingly, postcard-style
photo framing with route-line/pin motifs, and stamp badges. Design tokens (`paper`, `ink`,
`vermilion`, `sage`, `ochre`) live in `client/tailwind.config.js`.

## Monorepo layout

```
client/    React 19 + TypeScript + Vite + Tailwind (the SPA)
server/    Express + TypeScript API, serves the built client with an SPA fallback
shared/    Types, zod validation schemas, and small shared utilities (zod, SEO helpers)
supabase/  SQL migrations for the production Postgres schema
```

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in Supabase credentials if you have a project
pnpm dev                # runs the API server on :8787
pnpm dev:client          # in a second terminal: Vite dev server on :5173 (proxies /api)
```

Without `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` set, the API server automatically falls
back to an in-memory, seed-data-backed repository (`server/src/lib/localRepository.ts`) so
the whole site runs and is demoable with zero external setup. This is a **local/dev-only**
mode — writes are lost on restart, and it must never be used in production. All seed
content is explicitly flagged `isSeedContent: true` and rendered with a visible "Sample
content" badge; the seasonal-drought Cherrapunji field note is deliberately left as a
`planning_draft`/`draft` item to demonstrate that unverified content can never reach
`published` (enforced by zod in `shared/src/schemas.ts` and re-enforced server-side, see
`server/src/test/studio.test.ts`).

To go live against a real Supabase project: run the migration in
`supabase/migrations/0001_init.sql`, set `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` on the
server and `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` on the client (see `.env.example`),
then promote a user to editor by setting `profiles.is_editor = true` for their row.

## Production build

```bash
pnpm build   # builds shared -> client -> server, in that order
pnpm start   # runs the built Express server, which now serves the built client too
```

The Express server is a **single process**: it serves `/api/*`, `sitemap.xml`,
`robots.txt`, and the built SPA (with a lightweight server-side meta/JSON-LD injection
pass for real content routes — see `server/src/seo/`) from one Node process. This is a
hard deployment requirement, not an optimization.

## Testing

```bash
pnpm -r typecheck
pnpm -r lint
pnpm -r test
```

- `shared`: zod schema / editorial-rule unit tests (`schemas.test.ts`, `seo.test.ts`)
- `server`: API integration tests via supertest against the local repository, including an
  end-to-end test that the API rejects publishing content without verified first-hand
  reporting (`server/src/test/studio.test.ts`)
- `client`: component tests for the editorial-status badge and the map's graceful-degradation
  error boundary

## Editorial content rules

Enforced in `shared/src/schemas.ts` (and therefore in the Studio API, not just in docs):

- Content without `reportingStatus: "verified_firsthand"` can never reach
  `status: "published"` — it's rendered with a "Planning draft — pending verification" badge
  instead.
- `hasTimeSensitiveInfo: true` content must carry a `lastCheckedDate`.
- Draft/preview content is never returned by the public API (`GET /api/field-notes/:slug`
  404s for non-published slugs), so it can't be indexed or reached via a public URL.

## Map graceful degradation

`/map` always renders the full destination list as plain crawlable `<a>` links below the
interactive map — this isn't a fallback-only branch, it's always present, so destination
discovery never depends on the map (or its JS) loading successfully. The map itself is
also wrapped in a React error boundary that swaps in a text notice if Leaflet fails to
render.
