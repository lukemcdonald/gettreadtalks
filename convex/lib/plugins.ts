import type { DataModel } from '../_generated/dataModel';
import type { GenericCtx } from '@convex-dev/better-auth';
import type { FunctionReference } from 'convex/server';

import { requireActionCtx } from '@convex-dev/better-auth/utils';
import { HOUR } from '@convex-dev/rate-limiter';

import { internal } from '../_generated/api';

type RateLimitMutation = FunctionReference<
  'mutation',
  'internal',
  { key: string },
  { ok: boolean; retryAfter?: number }
>;

const RATE_LIMIT_ENDPOINTS: Record<
  string,
  { message: string; mutation: RateLimitMutation }
> = {
  '/change-password': {
    message: 'Too many password change attempts. Please try again later.',
    mutation: internal.model.auth.rateLimiter.checkChangePassword,
  },
  '/request-password-reset': {
    message: 'Too many reset requests. Please try again later.',
    mutation: internal.model.auth.rateLimiter.checkPasswordReset,
  },
  '/sign-in/email': {
    message: 'Too many login attempts. Please try again later.',
    mutation: internal.model.auth.rateLimiter.checkSignIn,
  },
  '/sign-up/email': {
    message: 'Too many registration attempts. Please try again later.',
    mutation: internal.model.auth.rateLimiter.checkSignUp,
  },
};

function getClientIp(request: Request): string {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim();

  if (!ip) {
    console.warn(
      '[auth-rate-limit] Could not determine client IP, using anonymous key'
    );
    return 'anonymous';
  }

  return ip;
}

function rateLimitedResponse(message: string, retryAfter: number): Response {
  return new Response(message, {
    headers: {
      'Content-Type': 'text/plain',
      'Retry-After': String(Math.ceil(retryAfter / 1000)),
    },
    status: 429,
  });
}

export function authRateLimitPlugin(ctx: GenericCtx<DataModel>) {
  return {
    id: 'auth-rate-limit',
    onRequest: async (request: Request) => {
      const url = new URL(request.url);
      const endpoint = Object.entries(RATE_LIMIT_ENDPOINTS).find(([suffix]) =>
        url.pathname.endsWith(suffix)
      );

      if (!endpoint) {
        return;
      }

      const [, { message, mutation }] = endpoint;
      const ip = getClientIp(request);
      const actionCtx = requireActionCtx(ctx);

      let result: { ok: boolean; retryAfter?: number };

      try {
        result = await actionCtx.runMutation(mutation, { key: ip });
      } catch (error) {
        console.error(
          '[auth-rate-limit] Rate limiter mutation failed, failing closed',
          error
        );

        return {
          response: rateLimitedResponse(
            'Service temporarily unavailable. Please try again later.',
            HOUR
          ),
        };
      }

      const { ok, retryAfter = HOUR } = result;

      if (ok) {
        return;
      }

      return { response: rateLimitedResponse(message, retryAfter) };
    },
  };
}
