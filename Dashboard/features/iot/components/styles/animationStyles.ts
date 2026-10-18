interface AnimationStylesParams {
  isDark: boolean;
}

export function getAnimationStyles({ isDark }: AnimationStylesParams): string {
  return `
    @keyframes golden-royal-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .golden-royal-text-shimmer {
      background: linear-gradient(
        120deg,
        var(--accent3) 0%,
        ${isDark ? "#ffd700" : "#d4af37"} 25%,
        var(--accent3) 50%,
        ${isDark ? "#ffffff" : "#b8860b"} 75%,
        var(--accent3) 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      animation: golden-royal-shimmer 5s linear infinite;
    }

    @keyframes header-glow {
      0%, 100% {
        filter: drop-shadow(0 0 1px rgba(212, 175, 55, 0.1));
        opacity: 0.95;
      }
      50% {
        filter: drop-shadow(0 0 6px var(--accent3-medium));
        opacity: 1;
      }
    }
    .header-noble-glow {
      animation: header-glow 4s ease-in-out infinite;
      background-size: 200% auto;
    }

    /* Dynamic seamless background image scrolling (GPU Accelerated) */
    .cuneiform-scroll-container {
      transform: translate3d(0, 0, 0);
      will-change: transform;
    }
    @keyframes cuneiform-slide {
      from {
        transform: translate3d(0, 0, 0);
      }
      to {
        transform: translate3d(400px, -400px, 0);
      }
    }
    .cuneiform-scroll-animated {
      animation: cuneiform-slide 45s linear infinite !important;
      will-change: transform;
    }

    @keyframes footer-border-glow {
      0%, 100% {
        border-color: var(--border-color);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      50% {
        border-color: var(--accent3-medium);
        box-shadow: 0 0 12px var(--accent3-transparent);
      }
    }
    .footer-animated-border {
      animation: footer-border-glow 6s ease-in-out infinite;
    }

    @keyframes footer-text-glow {
      0%, 100% {
        opacity: 0.8;
        color: var(--text-muted);
      }
      50% {
        opacity: 1;
        color: var(--text-secondary);
        text-shadow: 0 0 4px var(--accent3-transparent);
      }
    }
    .footer-animated-text {
      animation: footer-text-glow 6s ease-in-out infinite;
    }
  `;
}
