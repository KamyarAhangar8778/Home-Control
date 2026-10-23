"use client";

import React from "react";
import { Clock3, Layers, Settings2 } from "lucide-react";
import { Alert } from "@/components/reui/alert";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useAutomationForm } from "@/features/iot/components/AutomationsDrawer/hooks/useAutomationForm";
import AutomationForm from "@/features/iot/components/AutomationsDrawer/components/AutomationForm";
import AutomationList from "@/features/iot/components/AutomationsDrawer/components/AutomationList";
import AddSegmentForm from "@/features/iot/components/modules-drawer/components/AddSegmentForm";
import SegmentList from "@/features/iot/components/modules-drawer/components/SegmentList";
import { SETTINGS_TABS, type SettingsDrawerProps } from "@/features/settings/components/SettingsDrawer/types";
import { SettingsTabContent } from "@/features/settings/components/SettingsDrawer/SettingsTabContent";

type WorkspaceView = "modules" | "automations" | "settings";

const SECTION_META = {
  modules: {
    title: "پالایه و ماژول‌ها",
    description: "افزودن، مشاهده و مدیریت سگمنت‌های متصل به خانه",
    Icon: Layers,
  },
  automations: {
    title: "اتوماسیون‌ها",
    description: "زمان‌بندی، شرط‌ها و عملیات خودکار خانه را مدیریت کنید",
    Icon: Clock3,
  },
  settings: {
    title: "تنظیمات اصلی",
    description: "تنظیمات ظاهری، ارتباطی و رفتار داشبورد",
    Icon: Settings2,
  },
};

export default function WorkspaceSection({ view }: { view: WorkspaceView }) {
  const meta = SECTION_META[view];
  const Icon = meta.Icon;

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-right sm:px-6 sm:py-10 lg:py-12" dir="rtl">
      <header className="flex flex-col gap-3 border-b border-[var(--border-color)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--accent3)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-7 text-[var(--text-primary)] sm:text-2xl">{meta.title}</h1>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{meta.description}</p>
          </div>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">{view === "settings" ? `${SETTINGS_TABS.length} بخش تنظیمات` : "فضای کاری"}</span>
      </header>

      {view === "modules" && <ModulesWorkspace />}
      {view === "automations" && <AutomationsWorkspace />}
      {view === "settings" && <SettingsWorkspace />}
    </section>
  );
}

function ModulesWorkspace() {
  const { handleAddSegment, handleRemoveSegment } = useDashboard();
  const segments = useIoTStore(state => state.segments);
  const animationsEnabled = useIoTStore(state => state.animationsEnabled);

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AddSegmentForm
        onAddSegment={handleAddSegment}
        onClose={() => {}}
        segments={segments}
        animationsEnabled={animationsEnabled}
      />
      <div className="min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-5">
        <SegmentList segments={segments} onRemoveSegment={handleRemoveSegment} />
      </div>
    </div>
  );
}

function AutomationsWorkspace() {
  const formHook = useAutomationForm();

  return (
    <div className="space-y-6">
      <Alert variant="info" className="!flex !items-start !gap-3 !border-[var(--border-color)] !bg-[var(--card-bg)] text-sm leading-6 text-[var(--text-secondary)]">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>اتوماسیون‌ها را در همین فضای کاری بسازید، ویرایش کنید و فعال یا غیرفعال کنید.</p>
      </Alert>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <AutomationForm formHook={formHook} />
        <div className="min-w-0">
          <AutomationList
            handleEdit={formHook.handleEdit}
            handleDelete={formHook.handleDelete}
            handleToggle={formHook.handleToggle}
          />
        </div>
      </div>
    </div>
  );
}

function SettingsWorkspace() {
  const activeTab = useIoTStore(state => state.activeSettingsTab);
  const setActiveTab = useIoTStore(state => state.setActiveSettingsTab);
  const accent3 = useIoTStore(state => state.accent3);
  const accent4 = useIoTStore(state => state.accent4);
  const animationsEnabled = useIoTStore(state => state.animationsEnabled);
  const setAnimationsEnabled = useIoTStore(state => state.setAnimationsEnabled);
  const animationsFps = useIoTStore(state => state.animationsFps);
  const setAnimationsFps = useIoTStore(state => state.setAnimationsFps);
  const headerTitle = useIoTStore(state => state.headerTitle);
  const setHeaderTitle = useIoTStore(state => state.setHeaderTitle);
  const isDark = useIoTStore(state => state.isDark);

  const settingsProps: SettingsDrawerProps = {
    isOpen: true,
    onClose: () => {},
    activeTab,
    setActiveTab,
    accent3,
    accent4,
    animationsEnabled,
    setAnimationsEnabled,
    animationsFps,
    setAnimationsFps,
    headerTitle,
    setHeaderTitle,
    isDark,
  };

  const activeSettings = SETTINGS_TABS.find(tab => tab.id === activeTab) ?? SETTINGS_TABS[0];

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      <nav
        aria-label="دسته‌بندی تنظیمات"
        className="min-w-0 overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-2 lg:sticky lg:top-6 lg:overflow-visible"
      >
        <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col">
          {SETTINGS_TABS.map(tab => {
            const Icon = tab.Icon;
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 min-w-[150px] items-center gap-3 rounded-md border px-3 py-2.5 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent3)] lg:w-full lg:min-w-0 ${isActive
                  ? "border-[var(--accent3)] bg-[var(--card-hover-bg)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] hover:text-[var(--text-primary)]"}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--accent3)]" : ""}`} aria-hidden="true" />
                <span className="text-sm font-medium leading-5">{tab.compactTitle}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <section
        aria-labelledby="active-settings-heading"
        className="min-w-0 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
      >
        <header className="border-b border-[var(--border-color)] px-4 py-4 sm:px-6">
          <h2 id="active-settings-heading" className="text-base font-semibold leading-6 text-[var(--text-primary)]">
            {activeSettings.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            تنظیمات این بخش را از همین‌جا مدیریت کنید.
          </p>
        </header>
        <div className="min-w-0 p-4 sm:p-6">
          <SettingsTabContent {...settingsProps} activeTab={activeTab} />
        </div>
      </section>
    </div>
  );
}
