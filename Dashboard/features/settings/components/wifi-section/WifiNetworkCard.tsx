import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { WifiNetworkEditor } from "./WifiNetworkEditor";

interface Props {
  net: any;
  isEditing: boolean;
  tempSsid: string;
  setTempSsid: (val: string) => void;
  tempPassword: string;
  setTempPassword: (val: string) => void;
  onEditStart: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function WifiNetworkCard({
  net, isEditing,
  tempSsid, setTempSsid,
  tempPassword, setTempPassword,
  onEditStart, onDelete, onSave, onCancel
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-2xl shadow-sm relative overflow-hidden"
    >
      {isEditing ? (
        <WifiNetworkEditor
          tempSsid={tempSsid} setTempSsid={setTempSsid}
          tempPassword={tempPassword} setTempPassword={setTempPassword}
          onSave={onSave} onCancel={onCancel}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={onEditStart}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-[var(--text-primary)]">{net.ssid}</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] opacity-70">
              {net.password ? "رمز عبور تنظیم شده" : "بدون رمز عبور"}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-2 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-xl transition-colors ml-2"
            type="button"
            title="حذف شبکه"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
