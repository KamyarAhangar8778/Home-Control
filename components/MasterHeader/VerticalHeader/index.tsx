import { HousePlug, PanelRightClose, PanelLeftClose } from "lucide-react";
import type { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import ControlsIsland from "./ControlsIsland";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = props;

  return (
    <div
      id="vertical-master-header"
      className="flex h-full w-full flex-col gap-4 text-right font-sans [&_span]:hidden md:[&_span]:inline [&_h1]:hidden md:[&_h1]:block [&_p]:hidden md:[&_p]:block"
      dir="rtl"
    >
      <div className={`flex min-h-10 gap-2 border-b border-[var(--sidebar-border)] pb-4 ${isSidebarCollapsed ? "flex-col items-center" : "items-center justify-between"}`}>
        {isSidebarCollapsed ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--sidebar-text)]" aria-hidden="true">
            <HousePlug className="h-5 w-5" strokeWidth={1.8} />
          </div>
        ) : (
          <div className="hidden min-w-0 flex-1 md:block">
            <BrandBox headerTitle={props.headerTitle} />
          </div>
        )}
        {setIsSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--sidebar-muted)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent4)]"
            title={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
            aria-label={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
          >
            {isSidebarCollapsed ? <PanelLeftClose className="h-4 w-4 rotate-180" /> : <PanelRightClose className="h-4 w-4" />}
          </button>
        )}
      </div>

      <ControlsIsland props={props} />
    </div>
  );
}
