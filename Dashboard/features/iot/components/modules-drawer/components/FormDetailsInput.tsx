import React, { useState } from "react";
import IconPicker from "./IconPicker";

interface FormDetailsInputProps {
  customTitle: string;
  setCustomTitle: (val: string) => void;
  groupName: string;
  setGroupName: (val: string) => void;
  segmentIcon: string;
  setSegmentIcon: (val: string) => void;
  groupIcon: string;
  setGroupIcon: (val: string) => void;
  existingGroups: string[];
}

export default function FormDetailsInput({
  customTitle,
  setCustomTitle,
  groupName,
  setGroupName,
  segmentIcon,
  setSegmentIcon,
  groupIcon,
  setGroupIcon,
  existingGroups,
}: FormDetailsInputProps) {
  const [isNewGroup, setIsNewGroup] = useState(existingGroups.length === 0);

  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] theme-text-muted">(اختیاری)</span>
          <label className="text-[10px] theme-text-tertiary font-bold">
            عنوان دلخواه برای سگمنت:
          </label>
        </div>
        <input
          type="text"
          placeholder="مثال: رله پمپ آب حیاط"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-[var(--text-muted)]"
        />
      </div>

      <IconPicker 
        label="آیکون سگمنت:" 
        selectedIcon={segmentIcon} 
        onSelectIcon={setSegmentIcon} 
      />

      <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
        <label className="text-[10px] theme-text-tertiary font-bold block">گروه سگمنت:</label>
        
        {existingGroups.length > 0 && (
          <div className="flex items-center justify-end gap-3 mb-2 px-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={isNewGroup} onChange={() => setIsNewGroup(true)} className="accent-[var(--accent3)] w-3 h-3" />
              <span className="text-[10px] theme-text-secondary">گروه جدید</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={!isNewGroup} onChange={() => setIsNewGroup(false)} className="accent-[var(--accent3)] w-3 h-3" />
              <span className="text-[10px] theme-text-secondary">انتخاب از موجود</span>
            </label>
          </div>
        )}

        {!isNewGroup && existingGroups.length > 0 ? (
          <select
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans shadow-sm"
            dir="rtl"
          >
            {existingGroups.map((group) => (
              <option key={group} value={group} className="bg-[var(--bg-main)]">{group}</option>
            ))}
          </select>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="مثال: Test"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-[var(--text-muted)] shadow-sm"
            />
            
            <IconPicker 
              label="آیکون گروه جدید:" 
              selectedIcon={groupIcon} 
              onSelectIcon={setGroupIcon} 
            />
          </div>
        )}
      </div>
    </>
  );
}
