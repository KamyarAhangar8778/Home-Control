interface ThemeStylesParams {
  accent3: string;
  accent4: string;
  isDark: boolean;
}

export function getThemeStyles({
  accent3,
  accent4,
  isDark,
}: ThemeStylesParams): string {
  const selectedFontFamily = "var(--font-vazirmatn)";

  const defaultBg = isDark ? "#09090b" : "#ffffff";
  const defaultBgGradFrom = isDark ? "#09090b" : "#fafafa";
  const defaultBgGradVia = isDark ? "#09090b" : "#ffffff";
  const defaultBgGradTo = isDark ? "#09090b" : "#ffffff";

  const finalBgMain = defaultBg;
  const finalBgGradFrom = defaultBgGradFrom;
  const finalBgGradVia = defaultBgGradVia;
  const finalBgGradTo = defaultBgGradTo;

  return `
    :root {
      /* Selected Font Custom Configuration */
      --font-vazir: 'Vazirmatn', sans-serif;
      
      --selected-font: ${selectedFontFamily};
      
      --accent3: ${accent3};
      --accent4: ${accent4};
      --accent3-transparent: ${accent3}18;
      --accent4-transparent: ${accent4}18;
      --accent3-medium: ${accent3}44;
      --accent4-medium: ${accent4}44;
      --accent3-heavy: ${accent3}99;
      --accent4-heavy: ${accent4}99;

      /* Dynamic Theme Solvers */
      --bg-main: ${finalBgMain};
      --bg-gradient-from: ${finalBgGradFrom};
      --bg-gradient-via: ${finalBgGradVia};
      --bg-gradient-to: ${finalBgGradTo};
      --card-bg: ${isDark ? "rgba(9, 9, 11, 0.92)" : "rgba(255, 255, 255, 0.92)"};
      --card-bg-solid: ${isDark ? "#09090b" : "#ffffff"};
      --card-hover-bg: ${isDark ? "#18181b" : "#f4f4f5"};
      --text-primary: ${isDark ? "#fafafa" : "#18181b"};
      --text-secondary: ${isDark ? "#e4e4e7" : "#27272a"};
      --text-tertiary: ${isDark ? "#a1a1aa" : "#52525b"};
      --text-muted: ${isDark ? "#a1a1aa" : "#71717a"};
      --border-color: ${isDark ? "#27272a" : "#e4e4e7"};
      --drawer-gradient-from: ${isDark ? "#09090b" : "#ffffff"};
      --drawer-gradient-to: ${isDark ? "#09090b" : "#fafafa"};

      /* ReUI-inspired sidebar surfaces: neutral zinc scale, restrained borders. */
      --sidebar-bg: ${isDark ? "#09090b" : "#ffffff"};
      --sidebar-border: ${isDark ? "#27272a" : "#e4e4e7"};
      --sidebar-text: ${isDark ? "#fafafa" : "#18181b"};
      --sidebar-muted: ${isDark ? "#a1a1aa" : "#52525b"};
      --sidebar-hover: ${isDark ? "#27272a" : "#f4f4f5"};
      --sidebar-active: ${isDark ? "#3f3f46" : "#e4e4e7"};
      --sidebar-control-bg: ${isDark ? "#18181b" : "#fafafa"};
      --sidebar: ${isDark ? "#09090b" : "#ffffff"};
      --sidebar-foreground: ${isDark ? "#fafafa" : "#18181b"};
      --sidebar-primary: ${isDark ? "#fafafa" : "#18181b"};
      --sidebar-primary-foreground: ${isDark ? "#18181b" : "#fafafa"};
      --sidebar-accent: ${isDark ? "#27272a" : "#f4f4f5"};
      --sidebar-accent-foreground: ${isDark ? "#fafafa" : "#18181b"};
      --sidebar-ring: ${isDark ? "#a1a1aa" : "#71717a"};

      /* ReUI / shadcn semantic tokens for components installed from the registry. */
      --background: ${isDark ? "#09090b" : "#ffffff"};
      --foreground: ${isDark ? "#fafafa" : "#18181b"};
      --card: ${isDark ? "#09090b" : "#ffffff"};
      --card-foreground: ${isDark ? "#fafafa" : "#18181b"};
      --popover: ${isDark ? "#09090b" : "#ffffff"};
      --popover-foreground: ${isDark ? "#fafafa" : "#18181b"};
      --primary: ${isDark ? "#fafafa" : "#18181b"};
      --primary-foreground: ${isDark ? "#18181b" : "#fafafa"};
      --secondary: ${isDark ? "#27272a" : "#f4f4f5"};
      --secondary-foreground: ${isDark ? "#fafafa" : "#27272a"};
      --muted: ${isDark ? "#27272a" : "#f4f4f5"};
      --muted-foreground: ${isDark ? "#a1a1aa" : "#71717a"};
      --accent: ${isDark ? "#27272a" : "#f4f4f5"};
      --accent-foreground: ${isDark ? "#fafafa" : "#18181b"};
      --destructive: #dc2626;
      --destructive-foreground: ${isDark ? "var(--color-red-600)" : "var(--color-red-800)"};
      --border: ${isDark ? "#27272a" : "#e4e4e7"};
      --input: ${isDark ? "#27272a" : "#e4e4e7"};
      --ring: ${isDark ? "#a1a1aa" : "#71717a"};
      --radius: 0.5rem;
      --success: #10b981;
      --success-foreground: ${isDark ? "var(--color-emerald-600)" : "var(--color-emerald-900)"};
      --warning: ${isDark ? "var(--color-yellow-400)" : "var(--color-yellow-500)"};
      --warning-foreground: ${isDark ? "var(--color-yellow-600)" : "var(--color-yellow-900)"};
      --info: #8b5cf6;
      --info-foreground: ${isDark ? "var(--color-violet-600)" : "var(--color-violet-900)"};
      --invert: ${isDark ? "#f4f4f5" : "#18181b"};
      --invert-foreground: ${isDark ? "#18181b" : "#fafafa"};
    }
    
    html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
      font-family: var(--selected-font) !important;
    }
    
  `;
}
