import { httpRouter } from 'convex/server';

import { httpAction } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { resend } from './emails';

const http = httpRouter();

/**
 * Register the Better Auth routes with Convex HTTP router.
 *
 * @param http - The HTTP router.
 * @param createAuth - The function to create the Better Auth instance.
 */
authComponent.registerRoutes(http, createAuth);

/**
 * Register the Resend webhook route with Convex HTTP router.
 *
 * @param http - The HTTP router.
 * @param req - The request object.
 * @returns The response object.
 */
http.route({
  path: '/resend-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => await resend.handleResendEventWebhook(ctx, req)),
});

export default http;
