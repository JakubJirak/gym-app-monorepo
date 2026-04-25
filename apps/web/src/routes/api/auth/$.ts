import { createFileRoute } from "@tanstack/react-router";

/**
 * Custom auth proxy handler for Better Auth requests.
 * We intentionally forward only a minimal header set to avoid leaking
 * reverse-proxy headers that can break origin checks in production.
 */
function buildAuthProxyHeaders(request: Request, targetOrigin: string): Headers {
	const headers = new Headers();
	const requestHeaders = request.headers;
	const headerNames = ["cookie", "content-type", "accept", "authorization", "user-agent", "x-requested-with"];

	for (const name of headerNames) {
		const value = requestHeaders.get(name);
		if (value) {
			headers.set(name, value);
		}
	}

	const origin = requestHeaders.get("origin");
	const referer = requestHeaders.get("referer");
	headers.set("origin", origin ?? targetOrigin);
	headers.set("referer", referer ?? `${targetOrigin}/`);

	return headers;
}

function authHandler(request: Request): Promise<Response> {
	const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
	if (!convexSiteUrl) {
		throw new Error("VITE_CONVEX_SITE_URL is not set");
	}

	const requestUrl = new URL(request.url);
	const targetOrigin = new URL(convexSiteUrl).origin;
	const targetUrl = `${targetOrigin}${requestUrl.pathname}${requestUrl.search}`;
	const headers = buildAuthProxyHeaders(request, targetOrigin);
	const hasBody = request.method !== "GET" && request.method !== "HEAD";

	return fetch(targetUrl, {
		method: request.method,
		headers,
		redirect: "manual",
		...(hasBody
			? {
					body: request.body,
					duplex: "half",
				}
			: {}),
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
