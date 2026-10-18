import { isCloudflareEnabled, updatePinOnCloudflare, updateBatchPinsOnCloudflare } from "@/features/iot/services/cloudflareService";
import { publishPinCommand, publishBatchPinCommand } from "@/features/iot/services/mqttService";
import { getLocalWs } from "@/features/iot/services/localWs/client";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export async function syncSinglePin(pin: string, state: boolean, preventMqtt: boolean, autoOff: number | undefined, isPushMode: boolean, showToast: any) {
  const isLocal = useIoTStore.getState().isLocal;
  const ws = getLocalWs();

  if (isLocal && ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ command: "set_state", pin: parseInt(pin), state: state ? 1 : 0, timer: autoOff }));
  } else if (!preventMqtt) {
    publishPinCommand(pin, state, autoOff);
  }
  if (isCloudflareEnabled() && !isPushMode) {
    try {
      const result = await updatePinOnCloudflare(pin, state);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (e) {
      console.error(`Failed to sync pin ${pin} value to Cloudflare:`, e);
    }
  }
}

export async function syncBatchPins(actions: any[], segments: any[], isCfEnabled: boolean, showToast: any) {
  const mqttActions: { pin: string; state: boolean; timer?: number }[] = [];
  const cfActions: { pin: string; state: boolean }[] = [];

  for (const action of actions) {
    const segment = segments.find((s: any) => s.pin === action.targetPin);
    mqttActions.push({ pin: action.targetPin, state: action.actionOn, timer: segment?.auto_off });

    if (isCfEnabled && segment?.mode !== "push") {
      cfActions.push({ pin: action.targetPin, state: action.actionOn });
    }
  }

  const isLocal = useIoTStore.getState().isLocal;
  const ws = getLocalWs();

  if (isLocal && ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ command: "batch_state", actions: mqttActions }));
  } else {
    publishBatchPinCommand(mqttActions);
  }

  if (cfActions.length > 0) {
    try {
      const result = await updateBatchPinsOnCloudflare(cfActions);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (e) {
      console.error(`Failed to batch sync pins to Cloudflare:`, e);
    }
  }
}

