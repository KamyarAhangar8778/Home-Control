# 🏛️ Achaemenid IoT Dashboard

A minimalist, modular, and high-performance IoT dashboard integrated with ESP32 control systems, featuring traditional Persian symbolic aesthetics, Cuneiform details, and modern Cloudflare/MQTT connectivity.

---

## 🎨 Aesthetics & Philosophy
This dashboard blends historical Persian legacy with modern technology:
- **Achaemenid & Traditional Motifs**: Features custom theme variables based on traditional colors (e.g., imperial purple, Pasargadae gold, stone grey) and dynamic Cuneiform backgrounds.
- **Micro-Animations**: Uses fluid motion interactions representing historical talismans and symbolic transitions.
- **Layout Adaptability**: Supports dynamic header positions (vertical sidebar / horizontal navbar) and responsive column layouts (1 to 3 columns grid system).

---

## ⚡ Tech Stack & Tools

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (using `@theme` variables for dynamic styling)
- **Linter & Formatter**: Biome (for ultra-fast verification and code formatting)
- **State Management**: Zustand
- **Real-time Communication**: MQTT (via broker connectivity to ESP32 microcontrollers)
- **Data Querying**: TanStack React Query v5

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm or another package manager

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/KamyarAhangar8778/Real-CloudFlare-IoT-Dash.git
   cd Real-CloudFlare-IoT-Dash
   ```

2. Install the optimized dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Copy the example file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

---

## 🛠️ Development & Script Guidelines

This project uses **Biome** instead of ESLint/Prettier for style enforcement. Please refer to [CLAUDE.md](CLAUDE.md) for full commands:
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Clean Cache**: `npm run clean`

For structural details, check [ARCHITECTURE.md](ARCHITECTURE.md).
