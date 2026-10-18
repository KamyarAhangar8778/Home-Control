/**
 * @file durable-object/alarm-manager.ts
 * منطق زمانبندی و اجرای اتوماسیون‌ها از طریق DO Alarms
 *
 * بهینه‌سازی‌های اعمال‌شده:
 * - محاسبه timestamp در یک پاس (به جای دو پاس قبلی)
 * - نوشتن storage و setAlarm به‌صورت موازی با Promise.all
 * - خواندن automations و nextAlarmIds به‌صورت موازی در fireAlarm
 */

import { getNextTriggerTimestamp } from "../utils/scheduler";
import { getCurrentTemperature } from "../utils/weather";
import type { Automation } from "../types";

/** ساختار داخلی برای نگه‌داشتن زمان محاسبه‌شده هر اتوماسیون */
interface ScheduledEntry {
	id: string;
	ts: number;
}

/**
 * محاسبه و ثبت آلارم بعدی بر اساس لیست اتوماسیون‌های فعال.
 *
 * بهینه‌سازی: همه timestamp ها در یک پاس محاسبه می‌شوند،
 * و نوشتن به storage و setAlarm به‌صورت موازی اجرا می‌شود.
 */
export async function scheduleNextAlarm(storage: DurableObjectStorage): Promise<void> {
	const automations = (await storage.get<Automation[]>("automations")) ?? [];
	const activeAutomations = automations.filter((a) => a.enabled);

	if (activeAutomations.length === 0) {
		await storage.deleteAlarm();
		return;
	}

	// یک پاس: محاسبه timestamp برای همه اتوماسیون‌های فعال
	const now = new Date();
	const scheduled: ScheduledEntry[] = activeAutomations
		.map((auto) => ({ id: auto.id, ts: getNextTriggerTimestamp(auto.time, auto.days, now, auto.intervalMinutes) }))
		.filter((entry): entry is ScheduledEntry => entry.ts !== null);

	if (scheduled.length === 0) {
		await storage.deleteAlarm();
		return;
	}

	// پیدا کردن نزدیک‌ترین زمان
	const nextTime = Math.min(...scheduled.map((e) => e.ts));
	const nextAlarmIds = scheduled.filter((e) => e.ts === nextTime).map((e) => e.id);

	// نوشتن storage و ثبت آلارم به‌صورت موازی
	await Promise.all([
		storage.put("nextAlarmTime", nextTime),
		storage.put("nextAlarmIds", nextAlarmIds),
		storage.setAlarm(nextTime),
	]);
}

/**
 * اجرای اتوماسیون‌هایی که الان باید فعال شوند و ارسال payload به ESP از طریق WebSocket.
 *
 * بهینه‌سازی: خواندن automations و nextAlarmIds به‌صورت موازی.
 */
export async function fireAlarm(
	storage: DurableObjectStorage,
	getWebSockets: () => WebSocket[]
): Promise<void> {
	// خواندن موازی از storage
	const [automations, nextAlarmIds, macros] = await Promise.all([
		storage.get<Automation[]>("automations").then((v) => v ?? []),
		storage.get<string[]>("nextAlarmIds").then((v) => v ?? []),
		storage.get<import("../types").Macro[]>("macros").then((v) => v ?? []),
	]);

	const idSet = new Set(nextAlarmIds);
	const fired = automations.filter((a) => idSet.has(a.id));
	const sockets = getWebSockets();
	let automationsChanged = false;

	// کشِ دیتای آب‌وهوا برای جلوگیری از ریکوئست‌های تکراری در یک دوره‌ی اجرای آلارم
	const weatherCache = new Map<string, number | null>();

	// ارسال payload برای هر اتوماسیون فعال‌شده
	for (const auto of fired) {
		// --- بررسی شرط آب‌وهوا ---
		if (auto.conditionType === "weather" && auto.city) {
			let currentTemp: number | null = null;
			if (weatherCache.has(auto.city)) {
				currentTemp = weatherCache.get(auto.city) ?? null;
			} else {
				currentTemp = await getCurrentTemperature(auto.city);
				weatherCache.set(auto.city, currentTemp);
			}
			
			if (currentTemp !== null && auto.temperatureThreshold !== undefined) {
				const isGreater = auto.temperatureCondition === "greater";
				const conditionMet = isGreater 
					? currentTemp > auto.temperatureThreshold 
					: currentTemp < auto.temperatureThreshold;
				
				if (!conditionMet) {
					console.log(`[Automation] Skipped ${auto.id} due to weather condition (${currentTemp}°C vs threshold ${auto.temperatureThreshold}°C)`);
					continue;
				}
			}
		}

		// --- به‌روزرسانی تعداد تکرار (یک‌بار مصرف) ---
		if (auto.repeatCount !== undefined && auto.repeatCount > 0) {
			auto.repeatCount -= 1;
			automationsChanged = true;
			if (auto.repeatCount === 0) {
				auto.enabled = false;
				console.log(`[Automation] Disabled ${auto.id} as repeatCount reached 0.`);
			}
		}

		const allPins: { pin: number; state: boolean }[] = [];

		if (auto.actions) {
			for (const action of auto.actions) {
				if (action.targetMacro) {
					const m = macros.find(m => m.id === action.targetMacro);
					if (m && m.actions) {
						for (const ma of m.actions) {
							const pin = parseInt(ma.targetPin, 10);
							if (!isNaN(pin)) allPins.push({ pin, state: !!ma.actionOn });
						}
					}
				} else if (action.targetPin) {
					const pin = parseInt(action.targetPin, 10);
					if (!isNaN(pin)) allPins.push({ pin, state: !!action.actionOn });
				}
			}
		}

		if (allPins.length === 0) continue;

		// ساختن کامند 0x08
		const count = Math.min(allPins.length, 32);
		const payload = new Uint8Array(2 + count * 2);
		payload[0] = 0x08;
		payload[1] = count;
		for (let i = 0; i < count; i++) {
			payload[2 + i * 2] = allPins[i].pin;
			payload[3 + i * 2] = allPins[i].state ? 1 : 0;
		}

		for (const ws of sockets) {
			try {
				ws.send(payload);
			} catch {
				// اتصال قطع شده — نادیده گرفته می‌شود
			}
		}

		// ذخیره وضعیت پین‌ها تا با دریافت فیدبک، مقدار نهایی در DO آپدیت شود
		await storage.put("pending_automation_states", allPins);
	}

	// ذخیره تغییرات اتوماسیون‌ها (مانند غیرفعال شدن اتوماسیون‌های یک‌بار مصرف)
	if (automationsChanged) {
		await storage.put("automations", automations);
	}

	// آلارم بعدی را برنامه‌ریزی کن
	await scheduleNextAlarm(storage);
}
