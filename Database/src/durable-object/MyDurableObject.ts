/**
 * @file durable-object/MyDurableObject.ts
 * Durable Object اصلی: مدیریت WebSocket، state پین‌ها، و اتوماسیون‌ها
 *
 * بهینه‌سازی‌های اعمال‌شده:
 * - ذخیره automations و زمانبندی آلارم + broadcast به‌صورت موازی
 * - استفاده از ctx.waitUntil برای broadcast (fire-and-forget)
 */

import { DurableObject } from "cloudflare:workers";
import { scheduleNextAlarm, fireAlarm } from "./alarm-manager";
import { buildEspConfigText } from "../routes/config.route";
import type { Automation } from "../types";

export class MyDurableObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request): Promise<Response> {
		// WebSocket upgrade
		if (request.headers.get("Upgrade") === "websocket") {
			const [client, server] = Object.values(new WebSocketPair());
			this.ctx.acceptWebSocket(server);
			return new Response(null, { status: 101, webSocket: client });
		}

		// Internal route: به‌روزرسانی وضعیت پین از طریق fetch داخلی
		const url = new URL(request.url);
		if (url.pathname.startsWith("/pins/") && request.method === "POST") {
			const body = (await request.json()) as Record<string, unknown>;
			await this.setState(body);
			return new Response("OK");
		}

		return new Response("Not found", { status: 404 });
	}

	async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
		if (typeof message !== "string") return;
		try {
			const data = JSON.parse(message) as { type: string; pin?: string | number; state?: unknown; status?: string };
			
			if (data.type === "get_config") {
				console.log("[WebSocket] Config requested by ESP32");
				const value = await this.env.DASH_KV.get("main_config");
				const configText = await buildEspConfigText(this.env, value);
				ws.send(configText);
				return;
			}

			if (data.type === "get_all_states") {
				console.log("[WebSocket] get_all_states requested by ESP32");
				const configValue = await this.env.DASH_KV.get("main_config");
				if (!configValue) return;

				const parsed = JSON.parse(configValue);
				const configData = parsed?.payload ?? parsed ?? {};
				const segments = configData.segments_definition ?? configData.segments ?? [];
				const states: Record<string, boolean> = {};

				await Promise.all(
					segments.map(async (seg: any) => {
						try {
							if (seg && seg.pin != null) {
								const stub = this.env.MY_DURABLE_OBJECT.get(
									this.env.MY_DURABLE_OBJECT.idFromName("pin_" + seg.pin)
								);
								const state = await (stub as any).getState();
								states[String(seg.pin)] = state?.value === true;
							}
						} catch {}
					})
				);

				ws.send(JSON.stringify({
					type: "state_sync",
					states: states
				}));
				return;
			}

			if (data.type === "state_sync") {
				console.log("[WebSocket] state_sync received from ESP32");
				const states = (data as any).states;
				if (states && typeof states === "object") {
					for (const [pinStr, stateVal] of Object.entries(states)) {
						const pinDo = this.env.MY_DURABLE_OBJECT.get(
							this.env.MY_DURABLE_OBJECT.idFromName("pin_" + pinStr)
						);
						this.ctx.waitUntil(
							(pinDo as any).setState({ value: stateVal === true })
						);
					}
				}
				return;
			}
			
			if (data.type === "automation_ack") {
				console.log(`[Automation] Feedback received from ESP32: ${data.status}`);
				// اعمال تغییرات در DO
				const pending = await this.ctx.storage.get<{ pin: number; state: boolean }[]>("pending_automation_states");
				if (pending) {
					for (const p of pending) {
						const pinDo = this.env.MY_DURABLE_OBJECT.get(
							this.env.MY_DURABLE_OBJECT.idFromName("pin_" + p.pin)
						);
						this.ctx.waitUntil(
							(pinDo as any).setState({ value: p.state })
						);
					}
					await this.ctx.storage.delete("pending_automation_states");
				}
				return;
			}
			if (data.type !== "sync_pin") return;

			// به‌روزرسانی DO مربوط به پین از طریق RPC مستقیم
			const pinDo = this.env.MY_DURABLE_OBJECT.get(
				this.env.MY_DURABLE_OBJECT.idFromName("pin_" + data.pin)
			);
			// fire-and-forget: اجرای متد با RPC بدون overhead شبکه داخلی
			this.ctx.waitUntil(
				(pinDo as any).setState({ value: data.state })
			);
		} catch (e) {
			console.error("WS parse error", e);
		}
	}

	webSocketClose(ws: WebSocket): void {
		ws.close();
	}

	webSocketError(ws: WebSocket): void {
		ws.close();
	}

	/** ارسال payload باینری به تمام WebSocket‌های متصل */
	async testBroadcast(payload: Uint8Array): Promise<void> {
		for (const ws of this.ctx.getWebSockets()) {
			try {
				ws.send(payload);
			} catch {
				// اتصال قطع شده — نادیده گرفته می‌شود
			}
		}
	}

	/** گرفتن وضعیت کلی از storage */
	async getState(): Promise<Record<string, unknown>> {
		return ((await this.ctx.storage.get("data")) as Record<string, unknown>) ?? {};
	}

	/** به‌روزرسانی جزئی یا کلی وضعیت در storage */
	async setState(newData: Record<string, unknown>): Promise<Record<string, unknown>> {
		const current = await this.getState();
		const updated = { ...current, ...newData };
		await this.ctx.storage.put("data", updated);
		return updated;
	}

	/** ذخیره اتوماسیون‌ها و زمانبندی آلارم بعدی — موازی */
	async updateAutomations(automations: Automation[], macros: import("../types").Macro[] = []): Promise<void> {
		// ذخیره باید قبل از scheduleNextAlarm باشد (وابستگی داده‌ای)
		await Promise.all([
			this.ctx.storage.put("automations", automations),
			this.ctx.storage.put("macros", macros)
		]);

		// broadcast به ESP و زمانبندی آلارم به‌صورت موازی
		const times = automations.map((a) => a.time).join(", ");
		const debugMsg = `[TEST-WS] Worker received automations for times: ${times || "none"}`;

		await Promise.all([
			// broadcast (همه sockets را هدف می‌گیرد)
			Promise.resolve(
				void this.ctx.getWebSockets().forEach((ws) => {
					try { ws.send(debugMsg); } catch { /* ignored */ }
				})
			),
			// زمانبندی آلارم بعدی
			scheduleNextAlarm(this.ctx.storage),
		]);
	}

	/** فراخوانی توسط Cloudflare هنگام رسیدن زمان آلارم */
	async alarm(): Promise<void> {
		await fireAlarm(this.ctx.storage, () => this.ctx.getWebSockets());
	}
}
