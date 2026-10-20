import { httpRouter } from 'convex/server';

import { httpAction } from './_generated/server';
import { authComponent, createAuth } from './auth';
import { resend } from './emails';
import { handleEnrichmentRequest } from './model/talks/enrichment';

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
  handler: httpAction(
    async (ctx, req) => await resend.handleResendEventWebhook(ctx, req)
  ),
  method: 'POST',
  path: '/resend-webhook',
});

http.route({
  handler: httpAction(handleEnrichmentRequest),
  method: 'POST',
  path: '/enrichment',
});

export default http;
