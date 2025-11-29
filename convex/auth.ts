import type { DataModel } from './_generated/dataModel';

import { type GenericCtx, createClient } from '@convex-dev/better-auth';
import { convex as convexPlugin } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin as adminPlugin } from 'better-auth/plugins';

import { components } from './_generated/api';
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
 * Creates a new Better Auth instance.
 *
 * @param ctx - The Convex context.
 * @param options - The options for the Better Auth instance.
 * @returns The Better Auth instance.
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  const secret = process.env.BETTER_AUTH_SECRET;

  // invariant(secret, 'Missing required environment variable: BETTER_AUTH_SECRET');

  return betterAuth({
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
      convexPlugin(),
      nextCookies(), // Add nextCookies as the last plugin for automatic cookie handling
    ],
    secret,
    trustedOrigins: [
      'https://localhost:3000',
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
