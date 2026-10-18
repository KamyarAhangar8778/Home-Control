/**
 * @file routes/config.route.ts
 * مدیریت مسیر /config — تنظیمات اصلی پروژه (Cloudflare KV + DO Alarms)
 *
 * بهینه‌سازی‌های اعمال‌شده:
 * - در POST: KV.put و DO.updateAutomations به‌صورت موازی اجرا می‌شوند
 * - JSON یک‌بار parse می‌شود و نتیجه در هر دو مسیر استفاده می‌شود
 * - buildEspConfigText از Promise.all برای خواندن همزمان وضعیت پین‌ها استفاده می‌کند
 */

import { jsonResponse } from "../utils/response";
import type { PinConfig } from "../types";

const CONFIG_KEY = "main_config";

/**
 * ساخت یک خط S برای فرمت ESP_CFG_V2
 */
function buildSegmentLine(seg: PinConfig, pinValue: boolean): string {
	return `S id=${seg.id} type=${seg.type} pin=${seg.pin} val=${pinValue ? 1 : 0} ao=${seg.autoOffDelay ?? 0}\n`;
}

/**
 * ساخت خطوط Rule برای یک پین
 */
function buildRuleLines(seg: PinConfig): string {
	if (!seg.rule) return "";
	let lines = "";
	for (const act of seg.rule.highActions ?? []) {
		lines += `RH tgt=${act.targetPin} hld=${act.requiredHoldTime ?? 0} ast=${act.actionState ? 1 : 0} atp=${act.actionType ?? 0} dly=${act.delay ?? 0}\n`;
	}
	for (const act of seg.rule.lowActions ?? []) {
		lines += `RL tgt=${act.targetPin} hld=${act.requiredHoldTime ?? 0} ast=${act.actionState ? 1 : 0} atp=${act.actionType ?? 0} dly=${act.delay ?? 0}\n`;
	}
	return lines;
}

/**
 * ساخت متن فرمت ESP_CFG_V2 برای ارسال به میکروکنترلر.
 * وضعیت همه پین‌ها به‌صورت موازی از DO خوانده می‌شود.
 */
export async function buildEspConfigText(env: Env, value: string | null): Promise<string> {
	const parsed = JSON.parse(value ?? "{}");
	const data = parsed?.payload ?? parsed ?? {};
	const segments: PinConfig[] = data.segments_definition ?? data.segments ?? [];

	if (segments.length === 0) return "ESP_CFG_V2\n";

	// خواندن موازی وضعیت همه پین‌ها
	const pinStates = await Promise.all(
		segments.map(async (seg) => {
			try {
				const stub = env.MY_DURABLE_OBJECT.getByName("pin_" + seg.pin);
				return (await (stub as any).getState()) as { value?: boolean };
			} catch {
				return {} as { value?: boolean };
			}
		})
	);

	let text = "ESP_CFG_V2\n";
	
	if (data.mqtt) {
		const m = data.mqtt;
		if (m.broker_host && m.base_topic) {
			text += `M h=${m.broker_host} p=${m.broker_port || 1883} t=${m.base_topic} q=${m.qos ?? 1}\n`;
		}
	}

	if (data.wifi && Array.isArray(data.wifi.networks)) {
		for (const net of data.wifi.networks) {
			if (net.ssid && net.password) {
				text += `W s=${net.ssid} p=${net.password}\n`;
			}
		}
	}

	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		if (!seg || seg.pin == null) continue;
		text += buildSegmentLine(seg, !!pinStates[i]?.value);
		text += buildRuleLines(seg);
	}
	return text;
}

/**
 * Handler اصلی برای /config
 */
export async function handleConfig(
	request: Request,
	env: Env,
	path: string[],
	method: string
): Promise<Response> {
	if (method === "GET") {
		const value = await env.DASH_KV.get(CONFIG_KEY);

		if (path[1] === "esp") {
			try {
				const text = await buildEspConfigText(env, value);
				return new Response(text, {
					headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
				});
			} catch {
				return new Response("ESP_CFG_V2\n", { headers: { "Content-Type": "text/plain" } });
			}
		}

		// برای داشبورد: کل JSON تنظیمات
		return new Response(value ?? "{}", { headers: { "Content-Type": "application/json" } });
	}

	if (method === "POST" && !path[1]) {
		let bodyText: string;
		let configData: Record<string, any>;

		try {
			bodyText = await request.text();
			configData = JSON.parse(bodyText);
		} catch {
			return jsonResponse({ ack: false, error: "خطا در پردازش درخواست." }, 400);
		}

		try {
			const automations = configData.automations ?? configData.payload?.automations ?? [];
			const macros = configData.macros ?? configData.payload?.macros ?? [];
			const stub = env.MY_DURABLE_OBJECT.get(
				env.MY_DURABLE_OBJECT.idFromName("automations_controller")
			);

			// KV write و DO update به‌صورت موازی
			await Promise.all([
				env.DASH_KV.put(CONFIG_KEY, bodyText),
				(stub as any).updateAutomations(automations, macros).catch((err: unknown) => {
					console.error("Failed to update DO alarms", err);
				}),
			]);

			return jsonResponse({ ack: true, message: "تنظیمات با موفقیت در سرور ذخیره شد." });
		} catch {
			return jsonResponse({ ack: false, error: "خطا در ذخیره تنظیمات در KV." }, 500);
		}
	}

	return new Response("Method Not Allowed", { status: 405 });
}
