import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const siteUrl = process.env.BETTER_AUTH_BASE_URL || process.env.SITE_URL || "http://localhost:3000";

/**
 * The component client has methods needed for integrating Convex with
 * Better Auth, as well as helper methods for general use.
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    plugins: [
      convex(),
      nextCookies(), // Add nextCookies as the last plugin for automatic cookie handling
    ],
    database: authComponent.adapter(ctx),
    baseURL: siteUrl,
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: ["http://localhost:3000", "https://academic-reindeer-888.convex.site"],
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    // socialProviders: {
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID!,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   },
    // },
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
