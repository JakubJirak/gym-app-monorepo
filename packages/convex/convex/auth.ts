import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth";
import { expo } from '@better-auth/expo'

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [siteUrl, "gymappmobile://" , "expo://", "mobile://", "exp://", "http://localhost:3000", "http://localhost:8081"],
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

// Example function for getting the current user
// Feel free to edit, omit, etc.
// export const getCurrentUser = query({
//   args: {},
//   handler: async (ctx) => {
//     return authComponent.getAuthUser(ctx);
//   },
// });
