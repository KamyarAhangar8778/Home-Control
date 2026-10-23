import QuickAccessControls from "../QuickAccessControls";
import ClockWidget from "../ClockWidget";
import type { MasterHeaderProps } from "../types";

export default function ControlsIsland({ props }: { props: MasterHeaderProps }) {
  const { isSidebarCollapsed } = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-hidden py-1">
      <div className="custom-scrollbar flex flex-col gap-4 overflow-y-auto">
        <QuickAccessControls
          setIsModulesMenuOpen={props.setIsModulesMenuOpen}
          setIsMenuOpen={props.setIsMenuOpen}
          animationsEnabled={props.animationsEnabled}
          variant="vertical"
          isSidebarCollapsed={isSidebarCollapsed}
        />

      </div>

      <div className="hidden shrink-0 border-t border-[var(--sidebar-border)] pt-3 md:block">
        <ClockWidget variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
}
