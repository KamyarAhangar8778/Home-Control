export function getBaseStyles(isDark: boolean): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Space+Grotesk:wght@300..700&family=Cairo:wght@200..1000&family=Amiri:ital,wght@0,400..700;1,400..700&family=Changa:wght@200..800&family=Reem+Kufi:wght@400..700&family=Tajawal:wght@200..900&display=swap');

    /* Custom cursor personalizations */
    html, body {
      cursor: auto;
    }
    a, button, select, input, [role="button"], .cursor-pointer, [draggable="true"] {
      cursor: pointer !important;
    }

    /* Dropdown, Input, & Form Beautifications */
    select, input, textarea {
      transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s !important;
    }
    select:focus, input:focus, textarea:focus {
      border-color: var(--accent4) !important;
      box-shadow: 0 0 12px var(--accent4-transparent) !important;
      outline: none;
    }
    @media (min-width: 768px) {
      select:hover, input:hover {
        border-color: var(--accent3) !important;
      }
    }
    select option {
      background-color: ${isDark ? "#080c14" : "#ffffff"} !important;
      color: ${isDark ? "var(--text-primary)" : "#1e293b"} !important;
      padding: 12px !important;
      font-size: 13px !important;
    }

    /* Custom Royal scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-main);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--accent3-medium);
      border-radius: 4px;
      border: 2px solid var(--bg-main);
    }
    @media (min-width: 768px) {
      ::-webkit-scrollbar-thumb:hover {
        background: var(--accent3);
      }
    }
  `;
}
