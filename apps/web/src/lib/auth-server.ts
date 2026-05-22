import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
export const { handler, getToken, fetchAuthQuery, fetchAuthMutation, fetchAuthAction } = convexBetterAuthReactStart({
	convexUrl: process.env.VITE_CONVEX_URL as string,
	convexSiteUrl: process.env.VITE_CONVEX_SITE_URL as string,
});
