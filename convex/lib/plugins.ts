import type { GenericCtx } from '@convex-dev/better-auth';
import type { DataModel } from '../_generated/dataModel';

import { requireActionCtx } from '@convex-dev/better-auth/utils';
import { HOUR } from '@convex-dev/rate-limiter';

import { internal } from '../_generated/api';

export function signInRateLimitPlugin(ctx: GenericCtx<DataModel>) {
  return {
    id: 'sign-in-rate-limit',
    onRequest: async (request: Request) => {
      const url = new URL(request.url);

      if (!url.pathname.endsWith('/sign-in/email')) {
        return;
      }

      const ip =
        request.headers.get('cf-connecting-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        'anonymous';

      const actionCtx = requireActionCtx(ctx);

      const { ok, retryAfter = HOUR } = await actionCtx.runMutation(
        internal.model.auth.rateLimiter.checkSignIn,
        { key: ip },
      );

      if (ok) {
        return;
      }

      return {
        response: new Response('Too many login attempts. Please try again later.', {
          headers: {
            'Content-Type': 'text/plain',
            'Retry-After': String(Math.ceil(retryAfter / 1000)),
          },
          status: 429,
        }),
      };
    },
  };
}
