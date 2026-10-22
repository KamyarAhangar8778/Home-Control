# Design System — Home Control Dashboard

## Product and UX direction

Home Control Dashboard is a Persian-first control surface for ESP32 home automation. The interface should feel like a focused product workspace: calm, operational, and predictable under frequent use.
Use ChatGPT and Cloudflare Dashboard as interaction references, not as assets or exact copies. Prefer clear hierarchy, restrained chrome, subtle separators, consistent spacing, and controls whose state is immediately understandable.

## Navigation and header

- There is exactly one application header: a vertical navigation rail on the right side of the viewport, consistent with the application's RTL direction.
- The right rail is the only header/navigation layout on desktop and mobile. Do not add a top header or a left-side navigation variant.
- Do not expose header-position switchers, header-layout presets, or controls that can move navigation to another edge.
- Keep the rail compact on narrow screens: prioritize icon-based actions, accessible names, and no horizontal workspace overflow.
- Preserve existing application actions and behavior when adjusting the rail. Presentation changes must not alter MQTT topics, ESP32 payloads, Cloudflare synchronization, or automation logic.
- The product title may remain editable, but it must not control header placement.

## Color and appearance

- Default appearance is dark mode only.
- Use a neutral near-black canvas, slightly differentiated surface layers, restrained borders, and high-contrast text. Avoid ornamental gradients, glowing borders, and animation where they compete with device status or controls.
- The default palette is fixed by the product; users do not choose theme/accent colors from settings.
- Do not add a light/dark toggle or custom theme-color settings.
- Feature-specific colors that belong to a visualization, such as the matrix background effect, are not global theme controls and should remain scoped to that feature.
- Use color as a supporting signal, never the only indication of device state. Maintain readable contrast for active, pending, disabled, and error states.

## Typography

- Vazirmatn is the sole UI font, loaded through next/font.
- Do not load alternative UI font families or offer font selection, typography management, or font preview settings.
- Use a consistent type scale and weight hierarchy. Persian labels should be concise and align naturally in RTL layouts.
- Technical values may use semantic code styling when needed, but must not introduce another selectable application-wide font.

## Layout and responsive behavior

- The root document uses Persian language and RTL direction.
- Keep the right rail distinct from the workspace with spacing and a subtle border/surface difference rather than heavy shadows.
- The workspace must remain usable at desktop, tablet, and mobile widths. On narrow screens, keep navigation reachable and compact; do not fall back to a top header.
- Prefer consistent spacing and a small set of corner radii. Use cards only when grouping content improves scanning or task completion.

## Interaction and accessibility

- Use semantic buttons, accessible names for icon-only controls, visible keyboard focus, and appropriate disabled/pending states.
- Distinguish a requested command from confirmed device state when MQTT, WebSocket, or Cloudflare communication may fail.
- Use short, purposeful transitions for state changes and navigation. Respect reduced-motion preferences.
- Sound must never be required to understand or complete an action.

## Implementation boundaries

- Root layout and global font loading: app/layout.tsx and app/globals.css.
- Header/navigation: components/MasterHeader.tsx and components/MasterHeader/.
- Dashboard composition: features/dashboard/components/layout/.
- Shared dynamic CSS: features/iot/components/DashboardStyles.tsx and features/iot/components/styles/.
- Settings UI: features/settings/components/SettingsDrawer/.
- Keep styling local to the owning component unless it is a genuine shared token.
- Make surgical changes: redesign the header and appearance controls without refactoring unrelated dashboard, device, or automation features.
- Treat the implementation as the source of truth if this guide and the UI diverge; update this guide when the established design rules change.