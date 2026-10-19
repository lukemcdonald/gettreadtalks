import type { DataModel } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import type { AuthFunctions, GenericCtx } from '@convex-dev/better-auth';
import type { BetterAuthOptions } from 'better-auth';

import { createClient } from '@convex-dev/better-auth';
import { convex as convexPlugin } from '@convex-dev/better-auth/plugins';
import { requireActionCtx } from '@convex-dev/better-auth/utils';
import { betterAuth } from 'better-auth';
import { admin as adminPlugin, captcha } from 'better-auth/plugins';

import { components, internal } from './_generated/api';
import authConfig from './auth.config';
import authSchema from './betterAuth/schema';
import { authRateLimitPlugin } from './lib/plugins';
import { getSiteUrl } from './lib/siteUrl';
import { isPreviewSiteUrl } from './lib/turnstile';
import { formatErrorMessage } from './lib/utils';
import { destroyUserOwnedRows } from './model/users/utils';

const authFunctions: AuthFunctions = internal.auth;

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
    authFunctions,
    local: {
      schema: authSchema,
    },
    triggers: {
      user: {
        onCreate: async (ctx, doc) => {
          await scheduleWelcomeEmail(ctx, doc);
        },
        onDelete: async (ctx, doc) => {
          await destroyUserOwnedRows(ctx, doc._id);
        },
      },
    },
  }
);

export const { onCreate, onDelete, onUpdate } = authComponent.triggersApi();

const TRUSTED_ORIGINS = [
  'https://*.vercel.app',
  'https://gettreadtalks.com',
  'https://localhost:3000',
  'https://www.gettreadtalks.com',
];

/**
 * Precompiled so `isTrustedOrigin` doesn't rebuild a RegExp per request. A
 * `*` matches any run of non-slash, non-backslash characters, mirroring
 * Better Auth's own wildcard semantics (e.g. `https://*.vercel.app` also
 * matches multi-label subdomains like `a.b.vercel.app`).
 */
const TRUSTED_ORIGIN_MATCHERS: (string | RegExp)[] = TRUSTED_ORIGINS.map(
  (trustedOrigin) => {
    if (!trustedOrigin.includes('*')) {
      return trustedOrigin;
    }

    const pattern = trustedOrigin
      .replaceAll(/[.+?^${}()|[\]\\]/gu, '\\$&')
      .replaceAll('*', '[^/\\\\]+');
    return new RegExp(`^${pattern}$`, 'u');
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

let hasWarnedAuthEnv = false;

function warnIfAuthEnvInvalid(siteUrl: string) {
  if (hasWarnedAuthEnv || !process.env.BETTER_AUTH_SECRET) {
    return;
  }

  hasWarnedAuthEnv = true;

  if (!isTrustedOrigin(siteUrl, TRUSTED_ORIGIN_MATCHERS)) {
    console.warn(
      `SITE_URL "${siteUrl}" is not present in trustedOrigins. Auth links and cookies will target an origin the app does not trust.`
    );
  }

  if (!isPreviewSiteUrl(siteUrl) && !process.env.TURNSTILE_SECRET_KEY) {
    console.warn(
      'TURNSTILE_SECRET_KEY is not set. Sign-up and password-reset requests will fail captcha verification.'
    );
  }
}

function createAuthPlugins(ctx: GenericCtx<DataModel>, siteUrl: string) {
  const plugins = [
    adminPlugin({
      adminRoles: ['admin'],
      defaultRole: 'user',
    }),
    convexPlugin({
      authConfig,
      jwksRotateOnTokenGenerationError: true,
    }),
    authRateLimitPlugin(ctx),
  ];

  if (isPreviewSiteUrl(siteUrl)) {
    return plugins;
  }

  return [
    ...plugins,
    captcha({
      endpoints: ['/request-password-reset', '/sign-up/email'],
      provider: 'cloudflare-turnstile',
      secretKey:
        process.env.TURNSTILE_SECRET_KEY ?? 'analysis-placeholder-secret',
    }),
  ];
}

/**
 * Creates Better Auth options. Uses fallback values during module analysis.
 */
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const secret =
    process.env.BETTER_AUTH_SECRET ?? 'analysis-placeholder-secret';
  const siteUrl = getSiteUrl();
  const isHttps = siteUrl.startsWith('https://');

  warnIfAuthEnvInvalid(siteUrl);

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
        const actionCtx = requireActionCtx(ctx);
        await actionCtx.runAction(internal.emails.sendPasswordResetEmail, {
          email: user.email,
          resetUrl: url,
          token,
        });
      },
    },
    plugins: createAuthPlugins(ctx, siteUrl),
    secret,
    trustedOrigins: TRUSTED_ORIGINS,
    user: {
      changeEmail: {
        enabled: true,
        updateEmailWithoutVerification: true,
      },
      deleteUser: {
        enabled: true,
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

/**
 * Queue the welcome email so a send failure cannot roll back user creation.
 */
async function scheduleWelcomeEmail(
  ctx: MutationCtx,
  user: { _id: string; email: string; name: string }
) {
  try {
    await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
      email: user.email,
      name: user.name,
      userId: user._id,
    });
  } catch (error) {
    console.error(
      'Failed to schedule welcome email:',
      formatErrorMessage(error)
    );
  }
}
