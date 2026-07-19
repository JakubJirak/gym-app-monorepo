import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const CONVEX_URL = (import.meta.env.SSR
		? process.env.VITE_CONVEX_URL
		: import.meta.env.VITE_CONVEX_URL) as string;
	if (!CONVEX_URL) {
		console.error("missing envar VITE_CONVEX_URL");
	}
	const convexQueryClient = new ConvexQueryClient(CONVEX_URL, {
		expectAuth: false,
	});

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		context: { queryClient, convexQueryClient },
		scrollRestoration: true,
		defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
		defaultNotFoundComponent: () => <p>not found</p>,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}
