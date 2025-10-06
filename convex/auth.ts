import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { v } from 'convex/values';

import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query, QueryCtx } from './_generated/server';

const siteUrl = process.env.SITE_URL;

/**
 * The component client has methods needed for integrating Convex with
 * Better Auth, as well as helper methods for general use.
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    plugins: [
      convex(),
      nextCookies(), // Add nextCookies as the last plugin for automatic cookie handling
    ],
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    // TODO: Is trustedOrigins needed? Use env variables instead?
    trustedOrigins: ['http://localhost:3000', 'https://academic-reindeer-888.convex.site'],
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
  });
};

export const getUser = async (ctx: QueryCtx) => {
  return authComponent.safeGetAuthUser(ctx);
};

// Returns the currently authenticated user (Better Auth user object)
// Type-safe user data for client consumption
export const getCurrentUser = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    return await getUser(ctx);
  },
});
