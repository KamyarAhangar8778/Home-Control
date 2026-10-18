/**
 * @file routes/dashboard.route.ts
 * مدیریت مسیر /dashboard — وضعیت کلی داشبورد (Durable Object)
 */

import { jsonResponse } from "../utils/response";

/**
 * Handler برای GET/POST /dashboard
 */
export async function handleDashboard(
	request: Request,
	env: Env,
	method: string
): Promise<Response> {
	const stub = env.MY_DURABLE_OBJECT.getByName("dashboard_state");

	if (method === "GET") {
		const result = await (stub as any).getState();
		return jsonResponse(result);
	}

	if (method === "POST") {
		try {
			const body = (await request.json()) as Record<string, unknown>;
			const result = await (stub as any).setState(body);
			return jsonResponse({
				ack: true,
				message: "وضعیت داشبورد با موفقیت به‌روزرسانی شد.",
				data: result,
			});
		} catch {
			return jsonResponse({ ack: false, error: "خطا در به‌روزرسانی وضعیت داشبورد." }, 500);
		}
	}

	return new Response("Method Not Allowed", { status: 405 });
}
