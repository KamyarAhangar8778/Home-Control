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

  const defaultBg = isDark ? "#050609" : "#f4f5f7";
  const defaultBgGradFrom = isDark ? "#0d0f19" : "#ebedf0";
  const defaultBgGradVia = isDark ? "#050608" : "#f3f4f6";
  const defaultBgGradTo = isDark ? "#010203" : "#fcfdfe";

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
      --card-bg: ${isDark ? "rgba(9, 11, 17, 0.55)" : "rgba(252, 253, 254, 0.65)"};
      --card-bg-solid: ${isDark ? "#0b0c13" : "#fbfcfd"};
      --card-hover-bg: ${isDark ? "rgba(12, 14, 22, 0.7)" : "rgba(241, 243, 247, 0.8)"};
      --text-primary: ${isDark ? "#ffffff" : "#090a10"};
      --text-secondary: ${isDark ? "#e2e8f0" : "#2d3748"};
      --text-tertiary: ${isDark ? "#94a3b8" : "#4a5568"};
      --text-muted: ${isDark ? "#64748b" : "#718096"};
      --border-color: ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(9, 10, 16, 0.1)"};
      --drawer-gradient-from: ${isDark ? "#090a10" : "#fcfdfe"};
      --drawer-gradient-to: ${isDark ? "#020304" : "#ecf0f5"};

      /* ReUI-inspired sidebar surfaces: neutral zinc scale, restrained borders. */
      --sidebar-bg: ${isDark ? "#09090b" : "#ffffff"};
      --sidebar-border: ${isDark ? "#27272a" : "#e4e4e7"};
      --sidebar-text: ${isDark ? "#fafafa" : "#18181b"};
      --sidebar-muted: ${isDark ? "#a1a1aa" : "#52525b"};
      --sidebar-hover: ${isDark ? "#27272a" : "#f4f4f5"};
      --sidebar-active: ${isDark ? "#3f3f46" : "#e4e4e7"};
      --sidebar-control-bg: ${isDark ? "#18181b" : "#fafafa"};

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
      --destructive: ${isDark ? "#7f1d1d" : "#dc2626"};
      --border: ${isDark ? "#27272a" : "#e4e4e7"};
      --input: ${isDark ? "#27272a" : "#e4e4e7"};
      --ring: ${isDark ? "#a1a1aa" : "#71717a"};
      --radius: 0.5rem;
      --success: ${isDark ? "#4ade80" : "#15803d"};
      --success-foreground: ${isDark ? "#052e16" : "#f0fdf4"};
      --warning: ${isDark ? "#facc15" : "#a16207"};
      --warning-foreground: ${isDark ? "#422006" : "#fefce8"};
      --info: ${isDark ? "#7dd3fc" : "#0369a1"};
      --info-foreground: ${isDark ? "#082f49" : "#f0f9ff"};
    }
    
    html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
      font-family: var(--selected-font) !important;
    }
    
  `;
}
