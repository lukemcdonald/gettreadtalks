import type { DataModel } from './_generated/dataModel';
import type { GenericCtx } from '@convex-dev/better-auth';
import type { BetterAuthOptions } from 'better-auth';

import { createClient } from '@convex-dev/better-auth';
import { convex as convexPlugin } from '@convex-dev/better-auth/plugins';
import { requireActionCtx } from '@convex-dev/better-auth/utils';
import { betterAuth } from 'better-auth';
import { admin as adminPlugin } from 'better-auth/plugins';

import { components, internal } from './_generated/api';
import authConfig from './auth.config';
import authSchema from './betterAuth/schema';
import { authRateLimitPlugin } from './lib/plugins';

/**
 * Creates a new Better Auth component client.
 *
 * The component client has methods needed for integrating Convex with
 * Better Auth, as well as helper methods for general use.

 * @param ctx - The Convex context.
 * @returns The Better Auth component client.
 */
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
);

const TRUSTED_ORIGINS = [
  'https://*.vercel.app',
  'https://gettreadtalks.com',
  'https://localhost:3000',
  'https://www.gettreadtalks.com',
];

/**
 * Precompiled per trusted origin so `isTrustedOrigin` (called on every
 * `createAuthOptions()` invocation) doesn't rebuild a RegExp per request. A
 * `*` in a trusted origin matches a single-segment wildcard (e.g.
 * `https://*.vercel.app`).
 */
const TRUSTED_ORIGIN_MATCHERS: (string | RegExp)[] = TRUSTED_ORIGINS.map(
  (trustedOrigin) => {
    if (!trustedOrigin.includes('*')) {
      return trustedOrigin;
    }

    const pattern = trustedOrigin
      .replaceAll(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replaceAll('*', '[^.]+');
    return new RegExp(`^${pattern}$`);
  }
);

function isTrustedOrigin(
  origin: string,
  matchers: (string | RegExp)[]
): boolean {
  return matchers.some((matcher) =>
    typeof matcher === 'string' ? matcher === origin : matcher.test(origin)
  );
}

/**
 * Creates Better Auth options. Uses fallback values during module analysis.
 */
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const secret =
    process.env.BETTER_AUTH_SECRET ?? 'analysis-placeholder-secret';
  const siteUrl = process.env.SITE_URL ?? 'https://localhost:3000';
  const isHttps = siteUrl.startsWith('https://');

  if (!isTrustedOrigin(siteUrl, TRUSTED_ORIGIN_MATCHERS)) {
    console.warn(
      `SITE_URL "${siteUrl}" is not present in trustedOrigins. Auth links and cookies will target an origin the app does not trust.`
    );
  }

  return {
    advanced: {
      useSecureCookies: isHttps,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ token, url, user }) => {
        // console.log('[DEV] Password reset URL:', url);
        const actionCtx = requireActionCtx(ctx);
        await actionCtx.runAction(internal.emails.sendPasswordResetEmail, {
          email: user.email,
          resetUrl: url,
          token,
        });
      },
    },
    plugins: [
      adminPlugin({
        adminRoles: ['admin'],
        defaultRole: 'user',
      }),
      convexPlugin({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
      authRateLimitPlugin(ctx),
    ],
    secret,
    trustedOrigins: TRUSTED_ORIGINS,
    user: {
      changeEmail: {
        enabled: true,
        updateEmailWithoutVerification: true,
      },
    },
  } satisfies BetterAuthOptions;
};

/**
 * Creates a Better Auth instance.
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const options = createAuthOptions(ctx);
  return betterAuth(options);
};
