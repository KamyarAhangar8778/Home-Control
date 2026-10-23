import { Settings as SettingsIcon, Layers, Clock3, House } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import VoiceCommandButton from "../VoiceCommandButton";
import type { QuickAccessControlsProps } from "./types";

type WorkspaceView = "home" | "modules" | "automations" | "settings";

export default function VerticalControls({
  setIsModulesMenuOpen,
  setIsMenuOpen,
  animationsEnabled,
  variant,
  isSidebarCollapsed,
}: QuickAccessControlsProps) {
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);
  const activeWorkspaceView = useIoTStore(s => s.activeWorkspaceView);
  const setActiveWorkspaceView = useIoTStore(s => s.setActiveWorkspaceView);

  const itemClass = "flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-right text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent3-transparent)] hover:text-[var(--accent3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent4)]";
  const navClass = (view: WorkspaceView) =>
    `${itemClass} ${activeWorkspaceView === view ? "border-[var(--accent3-medium)] bg-[var(--accent3-transparent)] text-[var(--accent3)]" : ""}`;

  const navigateTo = (view: WorkspaceView) => {
    setActiveWorkspaceView(view);
    setIsModulesMenuOpen(false);
    setIsAutomationsMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="space-y-1" aria-label="بخش‌های کاربری">
      {!isSidebarCollapsed && (
        <span className="mb-2 block px-3 text-xs font-medium text-[var(--sidebar-muted)]">
          فضای خانه
        </span>
      )}

      <button
        type="button"
        onClick={() => navigateTo("home")}
        className={navClass("home")}
        aria-current={activeWorkspaceView === "home" ? "page" : undefined}
        title="داشبورد خانه"
        aria-label="داشبورد خانه"
      >
        <House className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">داشبورد خانه</span>}
      </button>

      <button
        type="button"
        onClick={() => navigateTo("modules")}
        className={navClass("modules")}
        aria-current={activeWorkspaceView === "modules" ? "page" : undefined}
        title="پالایه و ماژول‌ها"
        aria-label="پالایه و ماژول‌ها"
      >
        <Layers className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">پالایه و ماژول‌ها</span>}
      </button>

      <button
        type="button"
        onClick={() => navigateTo("automations")}
        className={navClass("automations")}
        aria-current={activeWorkspaceView === "automations" ? "page" : undefined}
        title="اتوماسیون‌ها"
        aria-label="اتوماسیون‌ها"
      >
        <Clock3 className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">اتوماسیون‌ها</span>}
      </button>

      <VoiceCommandButton
        animationsEnabled={animationsEnabled}
        variant={variant}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="my-3 border-t border-[var(--sidebar-border)]" />

      <button
        type="button"
        onClick={() => navigateTo("settings")}
        className={navClass("settings")}
        aria-current={activeWorkspaceView === "settings" ? "page" : undefined}
        title="تنظیمات اصلی"
        aria-label="تنظیمات اصلی"
      >
        <SettingsIcon className="h-4 w-4 shrink-0" />
        {!isSidebarCollapsed && <span className="text-sm">تنظیمات اصلی</span>}
      </button>
    </nav>
  );
}
