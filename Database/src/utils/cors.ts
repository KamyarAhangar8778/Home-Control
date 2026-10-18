/**
 * @file utils/cors.ts
 * هدرهای CORS و هلپرهای مربوطه
 */

export const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
} as const;

/**
 * افزودن هدرهای CORS به یک Response موجود
 */
export function withCors(response: Response): Response {
	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		headers.set(key, value);
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

/**
 * پاسخ استاندارد برای CORS preflight (OPTIONS)
 */
export function corsPreflightResponse(): Response {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
}
