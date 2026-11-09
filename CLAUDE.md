> **Git policy — never auto-commit or auto-push.** Leave work in the working tree. Run git commit, git push, gh pr create or a release script only when the user explicitly asks in that turn.

# raidr_agent_types

Shared TypeScript types for the RaidrAgent API and apps. Pure types plus a few tiny runtime helpers. No bundled runtime dependencies; every other raidr_agent repo depends on this one.

**Package**: `@sudobility/raidr_agent_types` — published to **GitHub Packages** under the `@sudobility` scope (not public npm). `.npmrc` routes `@sudobility` to `https://npm.pkg.github.com`.

**Stack**: TypeScript ~5.9 (ESM only, `target`/`lib` ES2020), Bun, Vitest, ESLint 9 (flat config) + Prettier. Peer deps: `@sudobility/types`, `@sudobility/raidr_types`.

## What raidr_agent is

A native agent app. It takes a user's plain-language request and:

1. finds the intent via **shapeshyft** (a hosted structured-AI endpoint);
2. filters the **raidr** catalog of MCP servers by label to sites that can serve that intent;
3. signs the user in to those sites in an in-app **web view** — site session tokens stay on the device and are never sent to the raidr_agent backend;
4. calls the sites through **raidr's hosted MCP** endpoint (raidr_api);
5. renders results with the **Vercel AI SDK**.

## Layering

```
raidr_agent_types -> raidr_agent_client -> raidr_agent_lib -> raidr_agent_app_rn
raidr_agent_types ------------------------------------------> raidr_agent_api
```

- `raidr_agent_types` — shared types and response helpers (this repo).
- `raidr_agent_client` — `RaidrAgentClient` HTTP class (injected `NetworkClient`) + TanStack Query hooks.
- `raidr_agent_lib` — business logic: Zustand stores and hooks composed from client hooks.
- `raidr_agent_api` — Hono + Postgres (Drizzle) backend; Firebase auth; talks to shapeshyft and raidr.
- `raidr_agent_app_rn` — the React Native app (separate repo).

All repos use **Bun only** — never npm, yarn or pnpm.

## Commands

```bash
bun install
bun run typecheck     # tsc --noEmit
bun run lint          # eslint src --ext .ts
bun run test:unit     # vitest run
bun run build         # tsc -p tsconfig.esm.json -> dist/
bun run verify        # typecheck + lint + test:unit + build (run before publishing)
```

## Source layout

```
src/
├── index.ts        # User, ApiInfoResponse, HealthResponse/HealthCheckData,
│                   # successResponse/errorResponse, isSuccessResponse/isErrorResponse,
│                   # re-exports from @sudobility/types; re-exports ./agent.js
├── index.test.ts
├── agent.ts        # the agent-flow contract (see below)
└── agent.test.ts
```

## Architecture notes

- `agent.ts` is the single source of truth for the request → intent → candidate sites → run flow, matching the raidr_agent_api endpoints (`POST /intent`, `/prepare`, `/runs`, `/candidates`, `/llm/payload`, `/runs/import`, `GET /sites/:apiHost/*`). It also defines the Vercel AI SDK stream parts (`RaidrAgentDataParts`, used as `UIMessage<never, RaidrAgentDataParts>`) and the **local mode** types (device calls the LLM provider and sites directly with the user's own key).
- Several string-union types ship a companion `readonly` array (e.g. `AGENT_STEPS`, `RESULT_KINDS`, `SELECTION_MODES`, `LOCAL_LLM_PROVIDERS`, `SITE_PAGE_ROUTE_SOURCES`) whose **order is meaningful** (default/precedence order). `agent.test.ts` asserts these arrays stay in sync and in order — update the array and the test together when editing a union.
- `agent.ts` imports `McpManifest` from the `@sudobility/raidr_types` peer dep (type-only).

## Conventions & gotchas

- **Keep this package free of bundled runtime dependencies.** Cross-repo shapes it mirrors (e.g. ShapeShyft's `AiProviderRequest`) are copied structurally, not imported, to avoid a dependency.
- Always build the response envelope `{ success, data?, error?, timestamp }` with `successResponse` / `errorResponse`; never hand-roll it.
- `HealthCheckData` is a placeholder alias of `HealthResponse` so the client/lib layers have one trivial export to build and test against.
- ESM only: relative imports use the `.js` extension (e.g. `export * from './agent.js'`) even though sources are `.ts`.
- Two ESLint config files exist (`eslint.config.js`, `eslint.config.mjs`); ESLint flat config loads `eslint.config.js`.

## CI/CD

`.github/workflows/ci-cd.yml` calls `johnqh/workflows/.github/workflows/unified-cicd.yml@main` on push and PR to `main`/`develop` (typecheck, lint, test, build; publish to GitHub Packages from `main`).

## Origin

Scaffolded from the mogulgame repos (a copy of the company "starter" template), with the game domain removed.
