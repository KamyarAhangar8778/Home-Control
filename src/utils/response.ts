/**
 * @file utils/response.ts
 * هلپرهای ساخت Response استاندارد
 */

/**
 * ساخت پاسخ JSON استاندارد با ساختار ACK
 */
export function jsonResponse(body: object, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}
