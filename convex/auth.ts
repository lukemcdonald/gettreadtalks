import type { DataModel } from './_generated/dataModel';

import { type GenericCtx, createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { v } from 'convex/values';

import { components } from './_generated/api';
import { query } from './_generated/server';
import { getCurrentUser as getUser } from './model/auth/queries';

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
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex(),
      nextCookies(), // Add nextCookies as the last plugin for automatic cookie handling
    ],
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [
      'http://localhost:3000',
      'https://*.vercel.app',
      'https://gettreadtalks.com',
      'https://www.gettreadtalks.com',
    ],
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
  });
};

// ============================================
// QUERIES
// ============================================

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getUser(ctx);
  },
  returns: v.union(v.any(), v.null()),
});
