export function useDashboardLayout(dashboardWidth: number) {
  const getOuterWidthClass = () => {
    switch (dashboardWidth) {
      case 1: return "max-w-[80rem]";
      case 2: return "max-w-[90rem]";
      case 3: return "max-w-[100rem]";
      case 4: return "max-w-[110rem]";
      case 5: return "max-w-full";
      default: return "max-w-[80rem]";
    }
  };

  const getInnerWidthClass = () => {
    switch (dashboardWidth) {
      case 1: return "max-w-4xl";
      case 2: return "max-w-5xl";
      case 3: return "max-w-6xl";
      case 4: return "max-w-7xl";
      case 5: return "max-w-full";
      default: return "max-w-4xl";
    }
  };

  const getTopHeaderContainerWidth = () => {
    switch (dashboardWidth) {
      case 1: return "max-w-6xl";
      case 2: return "max-w-7xl";
      case 3: return "max-w-[90rem]";
      case 4: return "max-w-[105rem]";
      case 5: return "max-w-full";
      default: return "max-w-6xl";
    }
  };

  const getLeftHeaderContentWidth = () => {
    switch (dashboardWidth) {
      case 1: return "max-w-5xl";
      case 2: return "max-w-6xl";
      case 3: return "max-w-7xl";
      case 4: return "max-w-[90rem]";
      case 5: return "max-w-full";
      default: return "max-w-5xl";
    }
  };

  return {
    outerWidthClass: getOuterWidthClass(),
    innerWidthClass: getInnerWidthClass(),
    topHeaderContainerWidth: getTopHeaderContainerWidth(),
    leftHeaderContentWidth: getLeftHeaderContentWidth(),
  };
}
