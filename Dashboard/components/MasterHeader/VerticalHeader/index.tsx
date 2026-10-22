import React from "react";
import { PanelRightClose, PanelLeftClose } from "lucide-react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import ControlsIsland from "./ControlsIsland";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = props;

  return (
    <div
      id="vertical-master-header"
      className="flex h-full w-full flex-col gap-5 text-right font-sans [&_span]:hidden md:[&_span]:inline [&_h1]:hidden md:[&_h1]:block [&_p]:hidden md:[&_p]:block"
      dir="rtl"
    >
      <div className="flex min-h-10 items-center justify-between gap-2">
        {!isSidebarCollapsed && <BrandBox headerTitle={props.headerTitle} />}
        {setIsSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent4)]"
            title={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
            aria-label={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
          >
            {isSidebarCollapsed ? <PanelLeftClose className="h-5 w-5 rotate-180" /> : <PanelRightClose className="h-5 w-5" />}
          </button>
        )}
      </div>

      <ControlsIsland props={props} />
    </div>
  );
}
