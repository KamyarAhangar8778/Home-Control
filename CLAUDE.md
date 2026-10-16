# CLAUDE.md — Development Guidelines

This file contains build, test, lint, code style, and structural guidelines for the Achaemenid IoT Dashboard project.

## Development Commands

- **Run Dev Server**: `npm run dev` (Runs Next.js with Turbopack)
- **Build Production**: `npm run build`
- **Start Production**: `npm run start` (Requires serving static export if standard start is not used)
- **Lint Code**: `npm run lint` (Runs Biome linter)
- **Format Code**: `npm run format` (Runs Biome formatter)
- **Clean Cache**: `npm run clean` (Cleans Next.js cache)

## Project Stack & Standards

- **Core Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Export Method**: Static Export (`output: "export"`) - **No API Routes support**
- **Styling**: Tailwind CSS v4 (using `@theme` and CSS variables, no legacy `tailwind.config.js`)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5 (Client-side fetches)
- **Forms/Validation**: React Hook Form, Zod
- **Animations**: Motion (Framer Motion)
- **Linter/Formatter**: Biome (replaces ESLint and Prettier)
- **IoT Integration**: MQTT (`mqtt` library)
- **Audio Handling**: Built-in HTML5 Web Audio and `AudioContext` for ambient tracks and UI effects.

## Coding Guidelines

### 1. Naming Conventions
- **Components**: PascalCase (e.g., `BrandBox.tsx`, `MasterHeader.tsx`)
- **Functions & Variables**: camelCase (e.g., `handleToggle`, `headerPosition`)
- **Types/Interfaces**: PascalCase (e.g., `MasterHeaderProps`)
- **Files/Folders**: Use feature-based folders in lower kebab-case/camelCase.

### 2. Code Structure & Architecture Constraints
- **Micro-Component Rule (< 100 lines)**: Files must be kept extremely small, ideally under 100 lines. If a component, hook, or service class grows too large, extract its responsibilities into separate sibling files. Use wrappers/index files to compose them back together.
- **Single Responsibility Principle**: A file should do exactly one thing. For example, rendering a list item (`Card.tsx`) and editing a list item (`Editor.tsx`) must reside in different files.
- **Static Export Limitations**: Next.js is configured for static site generation (`output: "export"`). You cannot create backend endpoints in `app/api/`. Any network requests to third parties (like the Internet Archive API) must happen directly on the client side.
- **Client Components**: Rely heavily on `"use client"` for interactivity, particularly since many modules integrate with the Web Audio API, Web Storage API, and external websockets (MQTT).
- **Modularity**: Prefer functional components with TypeScript interfaces. Separate features into the `features/` directory. Keep shared/global UI components in the `components/` directory.
- **Styling Constraints**: Avoid using legacy UI libraries. Rely on Tailwind CSS v4 and modern CSS features. Make heavy use of CSS variables for theming.
