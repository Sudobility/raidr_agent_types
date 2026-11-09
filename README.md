# raidr_agent_types

`@sudobility/raidr_agent_types` — shared TypeScript types for the RaidrAgent API and apps. Pure types plus a few tiny runtime helpers (`successResponse` / `errorResponse` / `isSuccessResponse` / `isErrorResponse`). No bundled runtime dependencies; `@sudobility/types` and `@sudobility/raidr_types` are peer dependencies.

Part of **raidr_agent**: a native agent app that turns a user request into an intent (shapeshyft), picks matching raidr MCP servers by label, signs the user in to those sites in a web view (tokens stay on device), calls them through raidr's hosted MCP, and renders the results with the Vercel AI SDK.

Layering: `raidr_agent_types` → `raidr_agent_client` → `raidr_agent_lib` → `raidr_agent_api` / `raidr_agent_app_rn`.

## What's inside

- `src/index.ts` — `User`, `ApiInfoResponse`, `HealthResponse`/`HealthCheckData`, the `{ success, data?, error?, timestamp }` response envelope helpers and type guards, and re-exports (`ApiResponse`, `BaseResponse`, `NetworkClient`, `Optional`) from `@sudobility/types`.
- `src/agent.ts` — the agent flow contract: `AgentIntent`, `CandidateSite`, `SiteAuthInfo`, `PrepareRequest`/`PrepareResponse`, `RunRequest`, `ResultItem`, the `RaidrAgentDataParts` stream parts, `RunSummary`/`RunDetail`, and local-mode types (`LocalLlmProvider`, `AgentStep`, `LlmPayloadRequest`/`Response`, `RunImportRequest`/`Response`).

## Development

Bun only — never npm, yarn or pnpm.

```bash
bun install
bun run typecheck     # tsc --noEmit
bun run lint          # eslint src
bun run test:unit     # vitest run
bun run build         # tsc -p tsconfig.esm.json -> dist/
bun run verify        # typecheck + lint + test:unit + build
```

## Install (as a consumer)

Published to **GitHub Packages** under the `@sudobility` scope (not public npm). Consumers need an `.npmrc` routing the scope to GitHub Packages plus a token with `read:packages`:

```
@sudobility:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_READ_TOKEN}
```

```bash
bun add @sudobility/raidr_agent_types
```

## CI/CD

`.github/workflows/ci-cd.yml` calls the reusable `johnqh/workflows/.github/workflows/unified-cicd.yml@main` on push and PR to `main` and `develop`; it typechecks, lints, tests, builds, and (from `main`) publishes to GitHub Packages (`publish-target: github`).

## License

BUSL-1.1
