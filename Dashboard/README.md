# Home Control Dashboard

A browser-based dashboard for monitoring and controlling ESP32-based home-automation devices. The project focuses on a modular React UI, device communication over MQTT/WebSocket transports, and configurable dashboard/settings experiences.

## Features and project areas

- Dashboard and workspace UI for home-automation controls.
- IoT feature modules for device-facing interactions and communication.
- Settings UI and shared presets.
- Shared header, query provider, and audio integration.
- Static-site deployment configuration for GitHub Pages.

Device availability depends on the ESP32 firmware, network connectivity, broker/socket configuration, and browser security policies. A successful UI command publish does not by itself guarantee that a physical device changed state.

## Technology

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS v4
- Zustand and TanStack React Query
- MQTT client and WebSocket-based device communication
- Motion and dnd-kit for interaction/drag-and-drop
- Biome for linting and formatting

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current source layout, module responsibilities, communication constraints, and contributor guidance. See [DESIGN.md](DESIGN.md) for verified UI conventions. Protocol and configuration references live in [docs/](docs/).

## Requirements

- Node.js compatible with the installed Next.js 15 release
- npm

## Local development

```bash
git clone https://github.com/KamyarAhangar8778/Home-Control-Dashboard.git
cd Home-Control-Dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If a feature requires environment values, copy the example file and fill in only the values you need:

```bash
cp .env.example .env.local
```

Do not commit `.env.local`, real credentials, private broker details, or API keys. Values embedded in a static client-side application are visible to users; do not put secrets in client-side configuration.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Run the production build/static export |
| `npm run lint` | Run Biome lint checks |
| `npm run format` | Format source directories in place |
| `npm run clean` | Remove local build/cache outputs |
| `npm run start` | Run the Next.js server; not intended to preview the static `out/` export |

Run `npm run lint` and `npm run build` before submitting changes when possible.

## GitHub Pages

The Next.js configuration applies the `/Home-Control-Dashboard` base path and asset prefix when `GITHUB_PAGES=true`. The deployment workflow is located at [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

The repository must have GitHub Pages configured to deploy using **GitHub Actions**. A workflow file alone does not enable Pages in repository settings. Check the Actions run and Pages settings if deployment fails.

## Repository hygiene

Keep source, documentation, lockfiles, and required static assets under version control. Do not commit local environment files, dependencies, build output, console logs, credentials, or temporary migration artifacts. The `.gitignore` file defines the primary exclusions.

## License

No license is declared in this repository yet. Do not assume the code is available for unrestricted reuse until a license is added.
