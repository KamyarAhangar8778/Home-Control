interface ThemeStylesParams {
  accent3: string;
  accent4: string;
  isDark: boolean;
  dashboardBgColor?: string;
  dashboardBgOpacity?: number;
}

export function getThemeStyles({
  accent3,
  accent4,
  isDark,
  dashboardBgColor = "default",
  dashboardBgOpacity = 10,
}: ThemeStylesParams): string {
  const selectedFontFamily = "var(--font-vazirmatn)";

  const defaultBg = isDark ? "#050609" : "#f4f5f7";
  const defaultBgGradFrom = isDark ? "#0d0f19" : "#ebedf0";
  const defaultBgGradVia = isDark ? "#050608" : "#f3f4f6";
  const defaultBgGradTo = isDark ? "#010203" : "#fcfdfe";

  let finalBgMain = defaultBg;
  let finalBgGradFrom = defaultBgGradFrom;
  let finalBgGradVia = defaultBgGradVia;
  let finalBgGradTo = defaultBgGradTo;

  if (dashboardBgColor !== "default") {
    let customColor = dashboardBgColor;
    if (dashboardBgColor === "accent3") customColor = accent3;
    if (dashboardBgColor === "accent4") customColor = accent4;
    
    finalBgMain = `color-mix(in srgb, ${customColor} ${dashboardBgOpacity}%, ${defaultBg})`;
    finalBgGradFrom = `color-mix(in srgb, ${customColor} ${dashboardBgOpacity}%, ${defaultBgGradFrom})`;
    finalBgGradVia = `color-mix(in srgb, ${customColor} ${dashboardBgOpacity}%, ${defaultBgGradVia})`;
    finalBgGradTo = `color-mix(in srgb, ${customColor} ${dashboardBgOpacity}%, ${defaultBgGradTo})`;
  }

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
    }
    
    html, body, button, h1, h2, h3, h4, h5, h6, select, span, input, textarea, .font-sans {
      font-family: var(--selected-font) !important;
    }
    
  `;
}
