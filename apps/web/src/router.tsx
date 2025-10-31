import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;
	// if (!CONVEX_URL) {
	// 	console.error("missing envar VITE_CONVEX_URL");
	// }
	const convex = new ConvexReactClient(CONVEX_URL, {
		expectAuth: true,
		unsavedChangesWarning: false,
	});
	//@ts-expect-error // convex splnuje typ
	const convexQueryClient = new ConvexQueryClient(convex);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	});
	convexQueryClient.connect(queryClient);

	const router = routerWithQueryClient(
		createRouter({
			routeTree,
			defaultPreload: "intent",
			context: { queryClient, convexClient: convex, convexQueryClient },
			scrollRestoration: true,
			Wrap: ({ children }) => (
				//@ts-expect-error // nejaky problemy s verzema, ale vse funguje
				<ConvexProvider client={convexQueryClient.convexClient}>{children}</ConvexProvider>
			),
		}),
		queryClient
	);

	return router;
}
