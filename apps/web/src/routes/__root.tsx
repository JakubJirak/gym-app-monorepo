import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import { QueryClient } from "@tanstack/react-query";
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexReactClient } from 'convex/react'
import { getCookie, getRequest } from '@tanstack/react-start/server'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { fetchSession, getCookieName } from '@convex-dev/better-auth/react-start'
import { authClient } from "@/lib/auth-client";
import { createServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { ThemeProvider, useTheme } from '@/data/providers/theme-provider'
import { getThemeServerFn } from '@/lib/theme'

const fetchAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { createAuth } = await import('../../../../packages/convex/convex/auth')
  const { session } = await fetchSession(getRequest())
  const sessionCookieName = getCookieName(createAuth)
  const token = getCookie(sessionCookieName)
  return {
    userId: session?.user.id,
    token,
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Gym tracker",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async (ctx) => {
      // all queries, mutations and action made with TanStack Query will be
      // authenticated by an identity token.
      const { userId, token } = await fetchAuth()
      // During SSR only (the only time serverHttpClient exists),
      // set the auth token to make HTTP queries with.
      if (token) {
        ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
      }
      return { userId, token }
    },
    component: RootComponent,
    loader: () => getThemeServerFn(),
    notFoundComponent: () => {
      return (
        <>
          <p className="mt-10 mb-5 text-red-500 text-center">
            Tato stránka nebyla nalezena
          </p>
          <div className="flex items-center justify-center">
            <Link to={"/"}>
              <Button>Domovská stránka</Button>
            </Link>
          </div>
        </>
      );
    },
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  const data = Route.useLoaderData();
  return (
    <ThemeProvider theme={data}>
    <ConvexBetterAuthProvider
      client={context.convexClient}
      authClient={authClient}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
    </ThemeProvider>
  )


  function RootDocument({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    return (
      <html lang="en" className={theme}>
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
        </body>
      </html>
    )
  }
}
