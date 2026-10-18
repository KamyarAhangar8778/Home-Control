# Architecture and Engineering Guide

This document is the primary technical guide for contributors and coding agents working on **Home-Control-Dashboard**. It describes the repository as it currently exists; when implementation and documentation disagree, inspect the source and update this guide rather than assuming an undocumented feature exists.

## 1. Project purpose

Home-Control-Dashboard is a browser-based control and configuration dashboard for ESP32-based home automation. Its UI is built with Next.js and React, while device communication is handled from the browser through MQTT and WebSocket connections. The repository includes dashboard, IoT, settings, audio, and shared UI modules.

The application is configured for static export in its normal production mode. It is therefore not a conventional Next.js server application: do not assume server routes, server-side persistence, or private server-side access to secrets are available.

## 2. Technology stack

- **Framework:** Next.js 15 App Router
- **UI:** React 19 and TypeScript
- **Styling:** Tailwind CSS v4, PostCSS, and CSS custom properties
- **Motion:** `motion`
- **Client state:** Zustand
- **Server-state/query utilities:** TanStack React Query v5
- **Drag and drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`
- **Device messaging:** `mqtt` (MQTT over WebSocket where supported)
- **Forms and validation dependencies:** React Hook Form resolver integration and Zod; use them where the relevant feature already follows this pattern
- **Linting and formatting:** Biome
- **Language/tooling:** TypeScript 5

The authoritative dependency and command definitions are in `package.json`; do not document scripts or libraries as active unless they exist there.

## 3. Repository map

```text
app/
  layout.tsx             Root document/layout and global providers
  page.tsx               Root route entry
  loading.tsx            Route loading UI
  not-found.tsx          Not-found UI
  globals.css            Global styles and design tokens
components/
  MasterHeader.tsx       Header/layout dispatcher
  MasterHeader/          Header subcomponents
  AudioInitializer.tsx   Audio initialization integration
  QueryProvider.tsx      TanStack Query provider
features/
  dashboard/
    components/          Dashboard/workspace UI
    context/             Dashboard-scoped context
    hooks/               Dashboard hooks
    index.ts             Feature entry point
  iot/
    components/          Device controls, status and IoT workspace UI
    hooks/               IoT state and behavior hooks
    services/            Communication and device integration
    utils/               IoT-specific utilities
  settings/
    components/          Settings sections and controls
lib/
  audio/                 Audio managers and UI sound effects
  presets.ts             Shared presets/configuration values
public/                  Static assets served by the frontend
docs/                    Protocol, configuration, and project reference docs
.github/workflows/       GitHub Actions automation
.env.example             Environment-variable template; contains placeholders only
next.config.ts           Next.js export and deployment configuration
biome.json               Lint/format rules
package.json             Scripts and dependency manifest
package-lock.json        Reproducible npm dependency lockfile
tsconfig.json            TypeScript compiler configuration
```

This is a high-level map, not an exhaustive listing. Inspect the relevant directory before adding files; preserve the existing feature boundaries and naming conventions.

## 4. Application entry and shared UI

- `app/layout.tsx` is the root layout. Global CSS belongs in `app/globals.css`; route-level composition belongs in the App Router files.
- `app/page.tsx` is the root route and should stay focused on composing the application rather than accumulating feature implementation.
- `components/` contains UI or providers shared by multiple features. Keep feature-specific behavior inside the owning `features/<feature>/` directory.
- `components/MasterHeader.tsx` and `components/MasterHeader/` implement the shared header system. Before changing navigation or header positioning, inspect both the dispatcher and its subcomponents.
- `components/QueryProvider.tsx` centralizes React Query provider setup.
- `components/AudioInitializer.tsx` integrates audio initialization with the UI lifecycle.

Avoid introducing duplicate global providers or parallel implementations of existing shared components.

## 5. Feature boundaries

### Dashboard — `features/dashboard/`

Owns the dashboard-level composition and workspace behavior. Its `components/`, `context/`, and `hooks/` directories separate rendering, scoped state/context, and reusable behavior. Keep the feature entry point (`index.ts`) aligned with its public exports.

### IoT — `features/iot/`

Owns ESP32-facing UI and client communication logic.

- `components/` renders device controls, workspace areas, connection/status feedback, and related interactions.
- `hooks/` encapsulates reusable IoT state and operations.
- `services/` contains communication integrations and related service logic.
- `utils/` contains IoT-specific helper functions.

Keep transport concerns out of presentational components where practical. Components should call a clear service or hook API rather than independently creating duplicate MQTT clients or subscriptions. Manage connection lifecycle and cleanup carefully; reconnecting, mounting, or changing a screen must not accidentally multiply listeners or publish duplicate commands.

### Settings — `features/settings/`

Owns settings UI and configuration controls. The current repository groups these under `features/settings/components/`; follow the existing subdivisions found there. Keep editing/validation logic separated from display code when that improves clarity, but avoid creating abstractions for one-off code without a real reuse or testing benefit.

### Shared utilities and audio — `lib/`

- `lib/presets.ts` stores shared preset/configuration values. Keep reusable constants out of individual components when multiple modules depend on them.
- `lib/audio/` contains audio-related implementation. Audio APIs are browser capabilities: guard initialization for browser availability and user-gesture restrictions, avoid creating redundant audio contexts, and clean up resources when appropriate.

## 6. Device communication and security boundaries

The frontend can communicate with ESP32 devices and brokers using browser-accessible transports. The repository also documents protocol details in `docs/`, including `docs/websocket-protocol-esp32.md`, `docs/websocket-protocol-keys-events.md`, and `docs/dashboard-configurations-protocol.md`.

Before changing message names, payload formats, pin identifiers, configuration keys, or connection fallback behavior:

1. Read the relevant protocol document.
2. Trace the existing publisher/subscriber or socket service implementation.
3. Keep payload shape and event names compatible with firmware and any existing dashboard configuration.
4. Handle unavailable brokers/devices and malformed or missing data without leaving the UI in a misleading state.
5. Ensure subscriptions and event handlers are removed when no longer needed.

A browser-delivered static app cannot keep secrets confidential. Never put private broker credentials, API keys, tokens, or personal network credentials into committed frontend code or public environment variables. `.env.example` must contain placeholders, not real secrets. Browser MQTT/WebSocket endpoints and any values shipped to the client should be treated as public. Do not use a private server-only environment variable in client code expecting it to be hidden.

## 7. State, data flow, and UI behavior

- Use the existing state owner for each domain. Do not introduce a second source of truth for a setting or device state already managed by a feature hook/store.
- Separate user intent from confirmed device state where the transport can fail or report updates asynchronously. Provide visible pending, connected/disconnected, and error states when relevant.
- Avoid assuming that publishing a command means the physical device has applied it.
- Use React Query for query/cache workflows already modeled with it; do not add it mechanically for local transient UI state.
- Keep components accessible: use semantic elements, labels for controls, keyboard-operable interactions, clear focus states, and status text that does not rely on color alone.
- Preserve responsive behavior and test narrow and wide viewports when modifying layouts.
- Respect reduced-motion preferences for nonessential animation where practical. Audio feedback must not be required to understand or complete an action.

## 8. Styling and design-system conventions

- The project uses Tailwind CSS v4 with PostCSS. Do not introduce a legacy Tailwind configuration file unless a concrete compatibility need is demonstrated.
- Prefer existing CSS custom properties, theme tokens, and established utility patterns over hard-coded duplicate colors.
- Keep global styles and global tokens in `app/globals.css`; component-specific styling should stay near the owning component unless it is genuinely shared.
- Reuse existing motion and icon dependencies rather than introducing overlapping libraries.
- Preserve the project's Persian-inspired visual identity where already implemented, but prioritize legibility, contrast, predictable controls, and consistent spacing over decorative effects.
- Do not impose a rigid 100-line file limit. Split modules when responsibility, complexity, reuse, or testability warrants it—not just to satisfy a line count.

## 9. Static export and deployment

`next.config.ts` sets `output: "export"` unless `DISABLE_HMR=true` is set. When `GITHUB_PAGES=true`, it configures the repository path as `basePath` and `assetPrefix`, and enables trailing slashes for GitHub Pages deployment.

Implications:

- Do not add `app/api/*` routes or rely on a persistent Next.js server in the static production build.
- All client-side endpoints must be reachable from the user's browser and comply with browser mixed-content/CORS/WebSocket restrictions.
- Validate internal links, static assets, and route behavior under the GitHub Pages base path, not only at the domain root.
- The Pages workflow is in `.github/workflows/deploy-pages.yml`. Keep its build output, artifact upload, and deployment configuration aligned with Next.js static export.
- Do not claim deployment is configured successfully merely because a workflow file exists; verify repository Pages settings and the workflow run itself.

The `start` script runs `next start`, which is not the normal way to serve a static export. For a production-export preview, serve the generated `out/` directory with a static file server.

## 10. Environment and generated files

- `.env.example` is the committed template. Copy it to `.env.local` for local development and populate values only when the relevant feature requires them.
- Real `.env*` files, dependency directories, build outputs, logs, and TypeScript build metadata should remain untracked.
- `next-env.d.ts` is a standard Next.js-generated type declaration and may be tracked; do not remove it merely because it is generated.
- `package-lock.json` is intentional and should be committed with dependency changes.
- Do not commit console dumps, local machine state, generated build artifacts, private keys, credentials, or one-off output files.

## 11. Developer workflow

Use Node.js compatible with the installed Next.js release and npm.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Available scripts in `package.json`:

- `npm run dev` — start the Next.js development server.
- `npm run build` — run a production build; the script sets `NODE_ENV=production`.
- `npm run start` — run the Next.js server (not a static-export preview).
- `npm run lint` — run Biome linting over `app`, `components`, `features`, and `lib`.
- `npm run format` — format those source directories in place; review the resulting diff before committing.
- `npm run clean` — remove local Next.js/export/build-metadata outputs.

Before submitting a change, run the relevant lint/build checks when possible and report checks that could not be run. Avoid formatting unrelated files or committing generated output.

## 12. Safe change procedure for coding agents

1. Read this guide and the relevant protocol/design documentation before editing.
2. Inspect the actual source, package scripts, and current GitHub Actions workflow; do not rely on outdated assumptions.
3. Make the smallest cohesive change within the owning feature.
4. Preserve TypeScript types, existing public exports, persisted configuration formats, and ESP32 message compatibility.
5. Check responsive layouts, loading/error states, keyboard access, and transport failure behavior for UI changes.
6. Run lint and production build checks where available.
7. Review the diff for unrelated formatting, secrets, logs, generated files, or temporary scripts.
8. Update this document when architecture, scripts, deployment behavior, or protocol ownership changes.

When uncertain, prefer inspecting existing patterns and protocol documents over inventing new conventions.
