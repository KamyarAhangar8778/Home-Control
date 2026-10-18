interface UtilityStylesParams {
  isDark: boolean;
  animationsEnabled: boolean;
}

export function getUtilityStyles({ isDark, animationsEnabled }: UtilityStylesParams): string {
  return `
    /* Active Performance Settings - Disabling CSS animations on demand */
    ${
      !animationsEnabled
        ? `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        animation: none !important;
        transition: none !important;
      }
    `
        : ""
    }

    ${
      isDark
        ? `
      div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) {
        background-color: var(--card-bg) !important;
      }
      div:nth-of-type(2) > div:nth-of-type(4) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(5) {
        background-color: var(--card-bg) !important;
      }
    `
        : ""
    }

    .theme-bg-main { background-color: var(--bg-main); }
    .theme-text-primary { color: var(--text-primary); }
    .theme-text-secondary { color: var(--text-secondary); }
    .theme-text-tertiary { color: var(--text-tertiary); }
    .theme-text-muted { color: var(--text-muted); }
    .theme-card-bg { background-color: var(--card-bg); }
    .theme-card-bg-solid { background-color: var(--card-bg-solid); }
    .theme-card-hover-bg { background-color: var(--card-hover-bg); }
    .theme-border { border-color: var(--border-color); }

    .text-accent3 { color: var(--accent3); }
    .text-accent4 { color: var(--accent4); }
    .bg-accent3 { background-color: var(--accent3); }
    .bg-accent4 { background-color: var(--accent4); }
    .border-accent3 { border-color: var(--accent3)0; }
    .border-accent4 { border-color: var(--accent4); }
    .border-accent3-medium { border-color: var(--accent3-medium); }
    .border-accent4-medium { border-color: var(--accent4-medium); }
  `;
}
