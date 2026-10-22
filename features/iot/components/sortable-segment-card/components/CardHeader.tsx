import React from "react";
import { Settings } from "lucide-react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import { AnimatePresence } from "motion/react";
import { BUTTON_CLIP } from "@/lib/presets";
import { SegmentData } from "../core/types";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useCardHeaderLayout } from "../hooks/useCardHeaderLayout";
import SegmentSettingsMenu from "./SegmentSettingsMenu";
import SegmentActions from "./SegmentActions";

interface CardHeaderProps {
  segment: SegmentData;
  isPinOn: boolean;
  isUltraCompact: boolean;
  isCompact: boolean;
  mode: "switch" | "push";
  onRemove: (id: string) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  countdown?: number | null;
  attributes: any;
  listeners: any;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
  groupMaxCols?: number;
}

export default function CardHeader({
  segment,
  isPinOn,
  isUltraCompact,
  isCompact,
  mode,
  onRemove,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  countdown,
  attributes,
  listeners,
  isSettingsOpen,
  setIsSettingsOpen,
  groupMaxCols,
}: CardHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmall = isUltraCompact || isCompact || isMobile;

  const showIconInHeader = !isSmall || (isMobile && groupMaxCols === 1);
  const showIconInMenu = isSmall && !showIconInHeader;

  const {
    isSettingsOpen: isLocalSettingsOpen,
    setIsSettingsOpen: setLocalSettingsOpen,
    showAutoOffMenu,
    setShowAutoOffMenu,
    buttonRef,
    menuRef,
    autoOffButtonRef,
    autoOffMenuRef,
  } = useCardHeaderLayout();

  const currentIsSettingsOpen = isSettingsOpen ?? isLocalSettingsOpen;
  const currentSetIsSettingsOpen = setIsSettingsOpen ?? setLocalSettingsOpen;

  const autoOffMenuProps = {
    showAutoOffMenu,
    setShowAutoOffMenu,
    autoOffButtonRef,
    autoOffMenuRef,
  };

  return (
    <div
      {...(isSmall ? attributes : {})}
      {...(isSmall ? listeners : {})}
      className={`flex items-center border-b border-[var(--border)] bg-[var(--muted)]/40 ${
        !showIconInHeader
          ? "justify-center p-2 cursor-grab active:cursor-grabbing"
          : isSmall
            ? "justify-center gap-12 p-2 cursor-grab active:cursor-grabbing"
            : "justify-between p-4"
      }`}
    >
      <div className={`flex items-center ${!showIconInHeader || isSmall ? "justify-center" : "gap-1.5 md:gap-2"}`}>
        {!isSmall && (
          <SegmentActions
            segment={segment}
            onRemove={onRemove}
            attributes={attributes}
            listeners={listeners}
            onUpdateSegmentMode={onUpdateSegmentMode}
            onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
            mode={mode}
            countdown={countdown}
            autoOffMenuProps={autoOffMenuProps}
          />
        )}

        {isSmall && (
          <div className="relative flex justify-center group/btn h-6 items-center">
            <button
              ref={buttonRef}
              onClick={() => currentSetIsSettingsOpen(!currentIsSettingsOpen)}
              className={`py-1 bg-[var(--secondary)] border border-[var(--border)] transition-colors cursor-pointer rounded-md flex items-center justify-center ${
                currentIsSettingsOpen
                  ? "border-[var(--ring)] text-[var(--foreground)] bg-[var(--accent)] w-[22px]"
                  : "w-[54px] md:group-hover/btn:w-[22px] text-[var(--muted-foreground)] md:group-hover/btn:bg-[var(--accent)] md:group-hover/btn:text-[var(--accent-foreground)]"
              }`}
              title="تنظیمات سگمنت"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Settings className="w-3.5 h-3.5 transition-transform duration-500 md:group-hover/btn:rotate-90 shrink-0" />
            </button>

            <AnimatePresence>
              <SegmentSettingsMenu
                segment={segment}
                isSettingsOpen={currentIsSettingsOpen}
                menuRef={menuRef}
                showIconInMenu={showIconInMenu}
                isPinOn={isPinOn}
                isUltraCompact={isUltraCompact}
                onRemove={onRemove}
                onUpdateSegmentMode={onUpdateSegmentMode}
                onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
                mode={mode}
                countdown={countdown}
                autoOffMenuProps={autoOffMenuProps}
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      {showIconInHeader && (
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-md transition-colors ${isPinOn ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}
            style={{ clipPath: BUTTON_CLIP }}
          >
            {segment.icon ? (
              ICON_MAP[segment.icon] ? (
                React.createElement(ICON_MAP[segment.icon], { className: "w-4 h-4" })
              ) : (
                <span className="text-sm leading-none flex items-center justify-center w-4 h-4">{segment.icon}</span>
              )
            ) : (
              React.createElement(ICON_MAP["Cpu"], { className: "w-4 h-4" })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
