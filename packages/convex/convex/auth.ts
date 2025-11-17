import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL as string;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
// @ts-expect-error
export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
	local: {
		schema: authSchema,
	},
});

export const createAuth = (ctx: GenericCtx<DataModel>, { optionsOnly } = { optionsOnly: false }) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly,
		},
		trustedOrigins: [
			siteUrl,
			"gymappmobile://",
			"expo://",
			"mobile://",
			"exp://",
			"http://localhost:3000",
			"http://localhost:8081",
		],
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		// Configure simple, non-verified email/password to get started
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			expo(),
			convex(),
			//crossDomain({ siteUrl })
		],
	});
};

export const getCurrentUser = query({
	args: {},
	//@ts-expect-error
	handler: async (ctx) => authComponent.getAuthUser(ctx),
});
