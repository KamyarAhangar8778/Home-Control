# Design System

This document records the UI conventions verified in the current implementation. Treat the components and CSS as the source of truth when this guide and implementation differ.

## Product identity

- Product: Home Control Dashboard, an ESP32 home-automation control interface.
- Language and direction: Persian-first; the root document uses `lang="fa"` and `dir="rtl"`.
- Visual direction: dark interface with Persian-inspired gold/amber accents. Prioritize clarity and operational status over decoration.

## Typography

- Primary font: Vazirmatn, configured through `--font-vazirmatn`.
- Monospace font: JetBrains Mono, configured through `--font-jetbrains`.
- Keep numeric, pin, protocol, and code-like values legible; use the existing monospace token where appropriate.
- The stylesheet currently imports additional Google Fonts. Do not assume those fonts are actively used without checking the relevant component.

## Color and styling

- Global page background: `#0b0c10`.
- Default foreground/accent: `#c5a880`.
- Selection styling uses a translucent amber background.
- Tailwind CSS v4 is configured through `@import "tailwindcss"` and `@theme` in `app/globals.css`.
- Prefer existing semantic classes and CSS custom properties such as `theme-text-tertiary`, `text-accent3`, and the established theme variables over introducing duplicate hard-coded values.
- Keep global tokens and global animations in `app/globals.css`; keep feature-specific styling near the owning component.

## Layout and interaction

- Preserve RTL layout and test both narrow and wide viewports.
- Use semantic controls, associated labels, visible keyboard focus, and accessible status text. Do not communicate device state through color alone.
- Distinguish a requested action from confirmed device state when MQTT, WebSocket, or Cloudflare communication can fail.
- Respect reduced-motion preferences for nonessential animation where practical. Audio must not be necessary to complete an action.
- Reuse the existing `lucide-react` and `motion` dependencies rather than adding overlapping icon or animation libraries.

## Source of truth

- Root document and metadata: `app/layout.tsx`
- Global typography, theme setup, and animations: `app/globals.css`
- Shared UI: `components/`
- Feature-specific UI: `features/<feature>/components/`
- Architecture and transport constraints: `ARCHITECTURE.md`

This guide intentionally documents only conventions verified in the repository. Extend it when a design token or component pattern becomes established in implementation.
