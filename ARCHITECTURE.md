# ARCHITECTURE.md — Project Architecture & Directory Structure

This document describes the design patterns, architecture, and module structure of the Achaemenid IoT Dashboard.

## Architecture Overview

The project follows a **Feature-Based Modular Architecture** built on top of **Next.js 15 (App Router)**. Because the project uses `output: "export"` for a static build, it acts purely as a Client-Side Application (SPA) leveraging modern React capabilities. Instead of organizing files strictly by their technical role, codebase items are grouped by their business feature inside the `features/` directory.

### Core Architectural Decisions

1. **Micro-Component Encapsulation (< 100 lines rule)**: Components, hooks, and services are rigorously divided into single-responsibility files that rarely exceed 100 lines. This ensures extreme maintainability and logical separation (e.g., separating a list item into `Card.tsx` and `Editor.tsx`).
2. **Global Shareables**: Only generic layouts or cross-feature configurations are placed in the root `components/` and `lib/` directories.
3. **Data Synchronisation**: Integrated with MQTT for real-time telemetry from ESP32 microcontrollers, managed through highly modularized services.
4. **Tailwind CSS v4 Integration**: Styling is modern and declaration-based, utilizing CSS custom properties for traditional Persian symbolic aesthetics.
5. **Static Export**: The app uses Next.js Static Export (`output: "export"`). There are no Server API routes (`app/api/*`). External API calls are performed directly from the client.

---

## Directory Structure

```
Real-CloudFlare-IoT-Dash/
├── app/                  # Next.js App Router (Layout, Page, Global CSS)
├── components/           # Generic / global shared React components
│   ├── MasterHeader/     # Main page layout headers (horizontal & vertical)
│   ├── AudioInitializer.tsx
│   ├── MasterHeader.tsx  # Dynamic header position dispatcher
│   └── QueryProvider.tsx # TanStack Query provider configuration
├── features/             # Feature-specific modules
│   ├── dashboard/        # Dashboard layout, container, and workspace components
│   ├── iot/              # Real-time IoT workspace, MQTT hooks, and ESP32 services
│   │   ├── components/   # Modular UI (Workspace, Notifications, Modals)
│   │   ├── hooks/        # Segmented state hooks (usePinOperations, useConnectionState)
│   │   └── services/     # Modular MQTT client (init, publishers, subscribers, events)
│   └── settings/         # Settings page components and logic
│       ├── components/   # Section chunks (audio, layout, matrix, macros, wifi, etc.)
├── lib/                  # Shared utility libraries and presets
│   ├── audio/            # Modular Audio Engine (SoundManager, AmbientManager, effects)
│   └── presets.ts        # Constants and theme configurations
├── public/               # Static assets (images, icons, fonts, local audio tracks)
├── biome.json            # Biome linter, formatter, and organizer configuration
├── metadata.json         # Next.js/AI Studio applet configuration metadata
├── next.config.ts        # Next.js configuration (static export enabled)
└── tsconfig.json         # TypeScript configuration
```

---

## Key Modules & Roles

### 1. The Header System (`components/MasterHeader`)
Renders the navigation layouts. Supports switching dynamically between vertical and horizontal alignment positions, responsive columns switcher, theme toggling, and fast access controls.

### 2. IoT Module (`features/iot`)
This is the core of the dashboard:
- **`services/mqtt/`**: The MQTT service is split into modules (`client.ts`, `init.ts`, `publishers.ts`, `subscriptions.ts`, `events.ts`) to manage connection setup and transactions with ESP32 units cleanly.
- **`hooks/achaemenidState/`**: State management logic is split into fine-grained hooks (e.g., `usePinOperations` for toggle logic, `useConnectionState` for network status).
- **`components/workspace/`**: Manages the drag-and-drop sortable interface for adding different IoT control segments.

### 3. Settings Module (`features/settings`)
Contains highly modularized configuration controls:
- Organized into discrete sub-directories (`layout-section`, `audio-section`, `wifi-section`, etc.).
- Each sub-directory implements a strict separation of concerns (e.g., `WifiNetworkCard.tsx` for view, `WifiNetworkEditor.tsx` for mutation).

### 4. Audio Management (`lib/audio/`)
A completely modular Web Audio API integration:
- **`AmbientManager.ts`**: Automatically plays/pauses background music, fetching traditional Persian playlists from the Internet Archive API or falling back to local files.
- **`effects.ts`**: Standalone synthesized oscillator functions (`playClickSynth`, `playToggleOnSynth`) for immediate UI sensory feedback.
- **`SoundManager.ts`**: The facade class exposing a unified API to the rest of the application.
