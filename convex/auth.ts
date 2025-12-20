import type { DataModel } from './_generated/dataModel';

import { type GenericCtx, createClient } from '@convex-dev/better-auth';
import { convex as convexPlugin } from '@convex-dev/better-auth/plugins';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin as adminPlugin } from 'better-auth/plugins';

import { components } from './_generated/api';
import authConfig from './auth.config';
import authSchema from './betterAuth/schema';

/**
 * Creates a new Better Auth component client.
 *
 * The component client has methods needed for integrating Convex with
 * Better Auth, as well as helper methods for general use.

 * @param ctx - The Convex context.
 * @returns The Better Auth component client.
 */
export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
  local: {
    schema: authSchema,
  },
});

/**
 * Creates Better Auth options without instantiating Better Auth.
 * This allows the component directory to access options without triggering
 * environment variable errors.
 *
 * @param ctx - The Convex context.
 * @returns Better Auth options object.
 */
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const secret = process.env.BETTER_AUTH_SECRET;

  return {
    advanced: {
      useSecureCookies: true, // Set to true and use `next dev --experimental-https`
    },
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      adminPlugin({
        adminRoles: ['admin'],
        defaultRole: 'user',
      }),
      convexPlugin({ authConfig }),
      nextCookies(), // Add nextCookies as the last plugin for automatic cookie handling
    ],
    secret,
    trustedOrigins: [
      'https://localhost:3000',
      'https://*.vercel.app',
      'https://gettreadtalks.com',
      'https://www.gettreadtalks.com',
    ],
  } satisfies BetterAuthOptions;
};

/**
 * Creates a new Better Auth instance.
 *
 * @param ctx - The Convex context.
 * @returns The Better Auth instance.
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const options = createAuthOptions(ctx);

  return betterAuth(options);
};
