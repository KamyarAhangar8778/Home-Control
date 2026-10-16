# DESIGN.md — UI/UX & Design System

This document outlines the design philosophy, aesthetic principles, and UI/UX patterns used in the Achaemenid IoT Dashboard.

## Design Philosophy

The overarching theme is a fusion of **Ancient Persian / Achaemenid Heritage** and **Modern Cyberpunk / IoT Functionality**. This "Ancient-Tech" aesthetic aims to provide a highly interactive, responsive, and culturally rich user experience.

### 1. Thematic Visuals (Ancient Persia)
- **Cuneiform & Patterns**: The UI utilizes traditional motifs, such as dynamic floating cuneiform characters (`CuneiformBackground`) and geometric Persian patterns, to create depth.
- **Color Palettes (`presets.ts`)**: The dashboard offers carefully curated, culturally inspired themes:
  - **Pasargad Gold**: Golden highlights mixed with dark obsidian (`#FBBF24`).
  - **Elam Bronze**: Deep cobalt blues and ancient bronze (`#CD7F32`).
  - **Agate Warrior**: Ruby reds and platinum slates, inspired by the Achaemenid Immortal Guards.
  - **Apadana Garden**: Emerald greens and terracotta.
  - **Persian Star**: Turquoise and persimmon orange.

### 2. Modern UI Patterns
- **Glassmorphism**: Extensive use of semi-transparent backgrounds with backdrop filters (e.g., `bg-[var(--card-bg-transparent)]`) to create a frosted glass effect over the ancient backgrounds.
- **Micro-Components**: The UI is built from extremely modular, small components. Every button, card, and layout section is highly specialized.
- **Micro-Animations**: Every interaction features fluid motion. Using `motion/react`, elements feature slide-ins, fade-ins, hover translations (`hover:-translate-y-1`), and scale effects on click.
- **Responsive Geometry**: Layouts fluidly adapt. The Master Header can dock vertically on desktops or transform into a horizontal bar on mobile devices.

### 3. Sensory Feedback (Audio UX)
The dashboard heavily relies on the Web Audio API for sensory feedback:
- **Ambient Tracks**: Traditional and instrumental Persian music (e.g., Tar, Setar) fetched from the Internet Archive plays in the background.
- **Synthesized Effects**: Soft sine-wave clicks for buttons, rising pitches for "Turn On" toggles, and descending pitches for "Turn Off" toggles. This provides an immersive, physical feel to digital IoT controls.

### 4. Custom Typography
- Integrates modern Persian web fonts (Vazirmatn, Lalezar, Shabnam) to match the cultural tone of the application.
- Employs monospaced fonts (`font-mono`) for technical data like IP addresses, MAC addresses, and raw sensor values to maintain the "Tech" aspect of the dashboard.

### 5. Layout Paradigms
- **Sortable Workspaces**: The main dashboard allows users to drag and drop sensor segments (e.g., Relays, RGB controllers, DHT sensors).
- **Progressive Disclosure**: Settings and complex controls are hidden behind drawers or accordions (`SettingsDrawer`, `Accordion` components) to prevent cognitive overload.
