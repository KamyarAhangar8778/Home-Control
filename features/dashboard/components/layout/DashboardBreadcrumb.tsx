"use client";

import { Clock3, House, Layers, Settings } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/reui/breadcrumb";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

const viewLabels = {
  home: "داشبورد خانه",
  modules: "پالایه و ماژول‌ها",
  automations: "اتوماسیون‌ها",
  settings: "تنظیمات اصلی",
} as const;

const viewIcons = {
  home: House,
  modules: Layers,
  automations: Clock3,
  settings: Settings,
} as const;

export default function DashboardBreadcrumb() {
  const activeView = useIoTStore(s => s.activeWorkspaceView);
  const ActiveIcon = viewIcons[activeView];

  return (
    <Breadcrumb dir="rtl" className="mb-5 px-1">
      <BreadcrumbList className="gap-2 text-[var(--text-secondary)]">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={event => {
              event.preventDefault();
              useIoTStore.getState().setActiveWorkspaceView("home");
              useIoTStore.getState().setIsModulesMenuOpen(false);
              useIoTStore.getState().setIsAutomationsMenuOpen(false);
              useIoTStore.getState().setIsMenuOpen(false);
            }}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[var(--card-hover-bg)] hover:text-[var(--accent3)]"
          >
            <House className="size-4" aria-hidden="true" />
            <span>خانه</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-[var(--text-muted)]" />
        <BreadcrumbItem>
          <BreadcrumbPage className="inline-flex items-center gap-2 text-[var(--text-primary)]">
            <ActiveIcon className="size-4 text-[var(--accent3)]" aria-hidden="true" />
            {viewLabels[activeView]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
