import React from "react";
import { Check, X } from "lucide-react";

interface Props {
  tempSsid: string;
  setTempSsid: (val: string) => void;
  tempPassword: string;
  setTempPassword: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function WifiNetworkEditor({
  tempSsid, setTempSsid,
  tempPassword, setTempPassword,
  onSave, onCancel
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-[var(--text-secondary)] mb-1">نام شبکه (SSID)</label>
        <input
          type="text"
          value={tempSsid}
          onChange={(e) => setTempSsid(e.target.value)}
          placeholder="SSID..."
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
          dir="ltr"
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--text-secondary)] mb-1">رمز عبور (اختیاری)</label>
        <input
          type="text"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
          placeholder="Password..."
          className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
          dir="ltr"
        />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={onSave}
          className="flex-1 p-2.5 bg-[var(--accent3)] text-white rounded-xl hover:bg-[var(--accent3-dark)] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[var(--accent3-transparent)]"
          type="button"
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-bold">ذخیره</span>
        </button>
        <button
          onClick={onCancel}
          className="p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--accent4)] hover:text-[var(--accent4)] transition-colors flex items-center justify-center bg-[var(--card-bg-solid)]"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
