import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import type { ConvexReactClient } from "convex/react";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/data/providers/theme-provider";
import { getThemeServerFn } from "@/lib/theme";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { authClient } from "../lib/auth-client";
import { getToken } from "../lib/auth-server";
import appCss from "../styles.css?url";

const getAuth = createServerFn({ method: "GET" }).handler(async () => await getToken());

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	convexClient: ConvexReactClient;
	convexQueryClient: ConvexQueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Gym tracker",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	beforeLoad: async (ctx) => {
		const token = await getAuth();
		// all queries, mutations and actions through TanStack Query will be
		// authenticated during SSR if we have a valid token
		if (token) {
			// During SSR only (the only time serverHttpClient exists),
			// set the auth token to make HTTP queries with.
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}
		return {
			isAuthenticated: !!token,
			token,
		};
	},
	component: RootComponent,
	loader: () => getThemeServerFn(),
	notFoundComponent: () => (
		<>
			<p className="mt-10 mb-5 text-center text-red-500">Tato stránka nebyla nalezena</p>
			<div className="flex items-center justify-center">
				<Link to={"/"}>
					<Button>Domovská stránka</Button>
				</Link>
			</div>
		</>
	),
});

function RootComponent() {
	const context = useRouteContext({ from: Route.id });
	const data = Route.useLoaderData();
	if (!context.convexClient) {
		throw new Error("Convex client is missing from router context.");
	}
	return (
		<ThemeProvider theme={data}>
			<ConvexBetterAuthProvider
				authClient={authClient}
				client={context.convexClient}
				initialToken={context.token}
			>
				<RootDocument>
					<Outlet />
				</RootDocument>
			</ConvexBetterAuthProvider>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const isDev = import.meta.env.DEV;
	return (
		<html className={theme} lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				{isDev ? (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				) : null}
				<Scripts />
			</body>
		</html>
	);
}
