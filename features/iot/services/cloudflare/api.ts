import { EspConfig } from "@/features/iot/services/esp32Config";
import { getCloudflareWorkerUrl, isCloudflareEnabled } from "./config";
import { serializeToCloudflare, deserializeFromCloudflare } from "./mappers";

/**
 * Fetch the latest config from Cloudflare Worker.
 */
export async function fetchConfigFromCloudflare(): Promise<EspConfig | null> {
  if (!isCloudflareEnabled()) return null;
  
  const urls = [
    "https://api.agkalaa.ir/config",
    "https://durable-object-worker.kamyarahangar157.workers.dev/config"
  ];

  try {
    const fetchPromises = urls.map(url => 
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }).then(async res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Cloudflare config from ${url}: ${res.statusText}`);
        }
        return await res.json();
      })
    );

    const data = await Promise.any(fetchPromises);
    return deserializeFromCloudflare(data);
  } catch (error) {
    console.error("Cloudflare fetchConfig error:", error);
    throw error;
  }
}

/** نتیجه استاندارد ACK از سرور */
export interface AckResult {
  success: boolean;
  message: string;
}

/**
 * Save configuration to Cloudflare Worker.
 * پاسخ ACK از سرور دریافت و به عنوان نتیجه برگردانده می‌شود.
 */
export async function saveConfigToCloudflare(config: EspConfig): Promise<AckResult> {
  if (!isCloudflareEnabled()) return { success: false, message: "اتصال کلودفلر غیرفعال است." };
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");
  const payload = serializeToCloudflare(config);

  try {
    const res = await fetch(`${baseUrl}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as any;

    if (res.ok && data?.ack) {
      return { success: true, message: data.message || "تنظیمات با موفقیت ذخیره شد." };
    }

    return { success: false, message: data?.error || "خطا در ذخیره تنظیمات." };
  } catch (error) {
    console.error("Cloudflare saveConfig error:", error);
    return { success: false, message: "تغییرات بنا به دلایل فنی ذخیره نشد." };
  }
}

/**
 * Update pin state on Durable Objects via Cloudflare Worker.
 * پاسخ ACK از سرور دریافت و به عنوان نتیجه برگردانده می‌شود.
 */
export async function updatePinOnCloudflare(pin: string, value: boolean): Promise<AckResult> {
  if (!isCloudflareEnabled()) return { success: false, message: "اتصال کلودفلر غیرفعال است." };
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");

  try {
    const res = await fetch(`${baseUrl}/pins/${pin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    const data = (await res.json()) as any;

    if (res.ok && data?.ack) {
      return { success: true, message: data.message || `وضعیت پین ${pin} ذخیره شد.` };
    }

    return { success: false, message: data?.error || `خطا در ذخیره وضعیت پین ${pin}.` };
  } catch (error) {
    console.error(`Cloudflare updatePinOnCloudflare error for pin ${pin}:`, error);
    return { success: false, message: `تغییرات پین ${pin} بنا به دلایل فنی ذخیره نشد.` };
  }
}

/**
 * Update multiple pins state simultaneously on Durable Objects via Cloudflare Worker.
 */
export async function updateBatchPinsOnCloudflare(
  actions: Array<{ pin: string; state: boolean }>
): Promise<AckResult> {
  if (!isCloudflareEnabled()) return { success: false, message: "اتصال کلودفلر غیرفعال است." };
  if (actions.length === 0) return { success: true, message: "دستوری برای اجرا وجود ندارد." };
  
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");

  try {
    const res = await fetch(`${baseUrl}/pins/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actions }),
    });

    const data = (await res.json()) as any;

    if (res.ok && data?.ack) {
      return { success: true, message: data.message || `وضعیت ${actions.length} پین گروهی ذخیره شد.` };
    }

    return { success: false, message: data?.error || `خطا در ذخیره وضعیت گروهی پین‌ها.` };
  } catch (error) {
    console.error(`Cloudflare updateBatchPinsOnCloudflare error:`, error);
    return { success: false, message: `تغییرات گروهی بنا به دلایل فنی ذخیره نشد.` };
  }
}

/**
 * Fetch states for all configured pins from Durable Objects.
 */
export async function fetchPinsFromCloudflare(
  segments: any[],
): Promise<Record<string, boolean> | null> {
  if (!isCloudflareEnabled()) return null;
  const baseUrl = getCloudflareWorkerUrl().replace(/\/$/, "");

  try {
    const pinsToFetch = Array.from(new Set(segments.map((s) => s.pin).filter(Boolean))) as string[];
    const result: Record<string, boolean> = {};

    await Promise.all(
      pinsToFetch.map(async (pin) => {
        try {
          const pinRes = await fetch(`${baseUrl}/pins/${pin}`);
          if (pinRes.ok) {
            const data = await pinRes.json();
            if (data && typeof data.value === "boolean") {
              result[pin] = data.value;
            }
          }
        } catch (e) {
          console.warn(`Could not fetch state for pin ${pin}:`, e);
        }
      }),
    );

    return result;
  } catch (error) {
    console.error("Could not complete fetchPinsFromCloudflare:", error);
    return null;
  }
}
