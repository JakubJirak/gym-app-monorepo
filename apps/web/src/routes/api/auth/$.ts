import { createFileRoute } from "@tanstack/react-router";

/**
 * Custom auth proxy handler that fixes the invalid Host header
 * set by @convex-dev/better-auth's reactStartHandler.
 * The library sets `Host: https://...` (with protocol), which is invalid.
 */
function authHandler(request: Request): Promise<Response> {
	const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
	if (!convexSiteUrl) {
		throw new Error("VITE_CONVEX_SITE_URL is not set");
	}

	const requestUrl = new URL(request.url);
	const targetUrl = `${convexSiteUrl}${requestUrl.pathname}${requestUrl.search}`;

	const headers = new Headers(request.headers);
	headers.set("accept-encoding", "application/json");
	// Set Host to just the hostname, not the full URL with protocol
	headers.set("host", new URL(convexSiteUrl).host);

	return fetch(targetUrl, {
		method: request.method,
		headers,
		redirect: "manual",
		body: request.body,
		// @ts-expect-error - duplex is required for streaming request bodies
		duplex: "half",
	});
}

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => authHandler(request),
			POST: ({ request }) => authHandler(request),
		},
	},
});
