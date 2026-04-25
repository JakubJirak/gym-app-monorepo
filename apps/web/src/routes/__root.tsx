import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
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
import { getCookie } from "@tanstack/react-start/server";
import type { ConvexReactClient } from "convex/react";
import { Button } from "@/components/ui/button";
import { ThemeProvider, useTheme } from "@/data/providers/theme-provider";
import { authClient } from "@/lib/auth-client";
import { getThemeServerFn } from "@/lib/theme";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

const AUTH_TOKEN_TIMEOUT_MS = 1500;

const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
	const convexUrl = process.env.VITE_CONVEX_URL;
	const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL;
	const convexJwtCookie =
		getCookie("__Secure-better-auth.convex_jwt") ??
		getCookie("better-auth.convex_jwt") ??
		getCookie("__session");
	const sessionTokenCookie =
		getCookie("__Secure-better-auth.session_token") ?? getCookie("better-auth.session_token");
	const hasAuthCookie = Boolean(convexJwtCookie || sessionTokenCookie);

	if (!convexUrl) {
		return {
			userId: hasAuthCookie ? "authenticated" : undefined,
			token: convexJwtCookie,
		};
	}
	if (!convexSiteUrl) {
		return {
			userId: hasAuthCookie ? "authenticated" : undefined,
			token: convexJwtCookie,
		};
	}
	if (!hasAuthCookie) {
		return {
			userId: undefined,
			token: undefined,
		};
	}

	let token = convexJwtCookie;

	try {
		const betterAuthServer = convexBetterAuthReactStart({
			convexUrl,
			convexSiteUrl,
		});
		const timedToken = await Promise.race<string | undefined>([
			betterAuthServer.getToken(),
			new Promise<string | undefined>((resolve) => {
				setTimeout(() => resolve(undefined), AUTH_TOKEN_TIMEOUT_MS);
			}),
		]);
		token = timedToken ?? token;
	} catch {
		// Keep SSR responsive if auth backend is temporarily unavailable.
	}

	return {
		userId: token || sessionTokenCookie ? "authenticated" : undefined,
		token,
	};
});

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
		// all queries, mutations and action made with TanStack Query will be
		// authenticated by an identity token.
		const { userId, token } = await fetchAuth();
		// During SSR only (the only time serverHttpClient exists),
		// set the auth token to make HTTP queries with.
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}
		return { userId, token };
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
	return (
		<ThemeProvider theme={data}>
			<ConvexBetterAuthProvider authClient={authClient} client={context.convexClient}>
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
