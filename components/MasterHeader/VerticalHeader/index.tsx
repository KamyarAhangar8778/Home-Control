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
      className="w-full h-full flex flex-col justify-stretch gap-4 text-right font-sans"
      dir="rtl"
    >
      {setIsSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-4 py-3 rounded-2xl shadow-sm flex items-center justify-center text-[var(--text-secondary)] md:hover:text-[var(--accent3)] md:hover:border-[var(--accent3)] transition-all duration-350"
          title={isSidebarCollapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
        >
          {isSidebarCollapsed ? <PanelLeftClose className="w-5 h-5 rotate-180" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      )}

      {!isSidebarCollapsed && (
        <BrandBox 
          headerTitle={props.headerTitle} 
          variant="vertical" 
          animationsEnabled={props.animationsEnabled}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
        />
      )}

      <ControlsIsland props={props} />
    </div>
  );
}
