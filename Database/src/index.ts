/**
 * @file index.ts
 * Entry point اصلی Worker — فقط routing
 * تمام منطق در ماژول‌های مجزا در src/ قرار دارد.
 */

import { MyDurableObject } from "./durable-object/MyDurableObject";
import { withCors, corsPreflightResponse } from "./utils/cors";
import { handleConfig } from "./routes/config.route";
import { handleDashboard } from "./routes/dashboard.route";
import { handlePins } from "./routes/pins.route";

export { MyDurableObject };

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname.split("/").filter(Boolean);
		const method = request.method.toUpperCase();

		// CORS preflight
		if (method === "OPTIONS") return corsPreflightResponse();

		// WebSocket upgrade → به DO ارسال می‌شود
		if (path[0] === "ws") {
			if (request.headers.get("Upgrade") !== "websocket") {
				return new Response("Expected Upgrade: websocket", { status: 426 });
			}
			const stub = env.MY_DURABLE_OBJECT.get(
				env.MY_DURABLE_OBJECT.idFromName("automations_controller")
			);
			return stub.fetch(request);
		}

		// تست broadcast به ESP
		if (path[0] === "test-ws") {
			try {
				const stub = env.MY_DURABLE_OBJECT.get(
					env.MY_DURABLE_OBJECT.idFromName("automations_controller")
				);
				await (stub as any).testBroadcast(new Uint8Array([0x06, 2, 1]));
				return withCors(new Response("WS Broadcast Success", { status: 200 }));
			} catch (e: any) {
				return withCors(new Response(`WS Error: ${e.message}`, { status: 200 }));
			}
		}

		// Route dispatch
		let response: Response;
		if (path[0] === "config") {
			response = await handleConfig(request, env, path, method);
		} else if (path[0] === "dashboard") {
			response = await handleDashboard(request, env, method);
		} else if (path[0] === "pins") {
			response = await handlePins(request, env, path, method);
		} else {
			response = new Response("Not Found", { status: 404 });
		}

		return withCors(response);
	},
} satisfies ExportedHandler<Env>;