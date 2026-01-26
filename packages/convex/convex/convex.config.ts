// @ts-expect-error all works fine
import betterAuth from "@convex-dev/better-auth/convex.config";
// @ts-expect-error path resolution issue but works fine at runtime
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(betterAuth);
app.use(rateLimiter);

export default app;
