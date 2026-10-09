import { fetchMutation, fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getClips } from '@/features/clips/queries/get-clips';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';
import { getCollections } from '@/features/collections/queries/get-collections';
import {
  createMcpRateLimitedHandler,
  mcpLimiterToken,
  mcpRateLimitKey,
  withMcpCors,
} from '@/features/mcp/rate-limit';
import { createTreadMcpHandler } from '@/features/mcp/tools';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';
import { getTalks } from '@/features/talks/queries/get-talks';
import { getTopicsWithCounts } from '@/features/topics/queries/get-topics-with-counts';

export const maxDuration = 60;

const mcpHandler = createTreadMcpHandler({
  getClipBySlug: (slug) => fetchQuery(api.clips.getClipBySlug, { slug }),
  getClips,
  getCollectionBySlug,
  getCollections,
  getSpeakers,
  getTalkBySlug,
  getTalks,
  getTopicsWithCounts,
});

async function consumeMcpRateLimit(request: Request) {
  const secret = process.env.BETTER_AUTH_SECRET;
  const token = mcpLimiterToken(secret);

  if (!token) {
    return { ok: true, retryAfter: null };
  }

  try {
    return await fetchMutation(api.model.auth.rateLimiter.checkMcp, {
      key: mcpRateLimitKey(request, secret),
      token,
    });
  } catch {
    return { ok: true, retryAfter: null };
  }
}

const handleMcpRequest = createMcpRateLimitedHandler(
  mcpHandler,
  consumeMcpRateLimit
);

export function OPTIONS() {
  return withMcpCors(new Response(null, { status: 204 }));
}

export {
  handleMcpRequest as DELETE,
  handleMcpRequest as GET,
  handleMcpRequest as POST,
};
