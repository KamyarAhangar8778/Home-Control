import React, { useState } from "react";
import { Plus, Wifi } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { AnimatePresence } from "motion/react";
import { WifiNetworkCard } from "./WifiNetworkCard";

export default function WifiSection() {
  const { wifiNetworks, setWifiNetworks } = useIoTStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempSsid, setTempSsid] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const handleAddNetwork = () => {
    const newId = `wifi_${Date.now()}`;
    setWifiNetworks((prev) => [
      ...prev,
      { id: newId, ssid: "شبکه جدید", password: "" },
    ]);
    setEditingId(newId);
    setTempSsid("شبکه جدید");
    setTempPassword("");
  };

  const handleEditNetwork = (id: string, ssid: string, password?: string) => {
    setEditingId(id);
    setTempSsid(ssid);
    setTempPassword(password || "");
  };

  const handleSaveNetwork = (id: string) => {
    if (!tempSsid.trim()) return;
    setWifiNetworks((prev) =>
      prev.map((net) =>
        net.id === id
          ? { ...net, ssid: tempSsid, password: tempPassword }
          : net
      )
    );
    setEditingId(null);
  };

  const handleRemoveNetwork = (id: string) => {
    setWifiNetworks((prev) => prev.filter((net) => net.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Wifi className="w-5 h-5 text-[var(--accent3)]" />
          تنظیمات شبکه‌های وای‌فای
        </h3>
        <button
          onClick={handleAddNetwork}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن شبکه جدید"
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        در این بخش می‌توانید اطلاعات شبکه‌های وای‌فای (SSID و رمز عبور) را برای تراشه ESP32 تعریف کنید. تراشه به هنگام راه‌اندازی به ترتیب به این شبکه‌ها متصل خواهد شد.
      </p>

      <div className="space-y-4">
        <AnimatePresence>
          {wifiNetworks.map((net) => (
            <WifiNetworkCard
              key={net.id}
              net={net}
              isEditing={editingId === net.id}
              tempSsid={tempSsid} setTempSsid={setTempSsid}
              tempPassword={tempPassword} setTempPassword={setTempPassword}
              onEditStart={() => handleEditNetwork(net.id, net.ssid, net.password)}
              onDelete={() => handleRemoveNetwork(net.id)}
              onSave={() => handleSaveNetwork(net.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </AnimatePresence>
        
        {wifiNetworks.length === 0 && (
          <div className="text-center p-6 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)]">
            <Wifi className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">هیچ شبکه وای‌فای تعریف نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
