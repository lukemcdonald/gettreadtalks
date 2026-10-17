import { fetchMutation, fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { loadClips } from '@/features/clips/queries/load-clips';
import { loadCollectionBySlug } from '@/features/collections/queries/load-collection-by-slug';
import { loadCollections } from '@/features/collections/queries/load-collections';
import {
  createMcpRateLimitedHandler,
  mcpLimiterToken,
  buildMcpRateLimitKey,
  withMcpCors,
} from '@/features/mcp/rate-limit';
import { createTreadMcpHandler } from '@/features/mcp/tools';
import { loadSpeakers } from '@/features/speakers/queries/load-speakers';
import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import { loadTalks } from '@/features/talks/queries/load-talks';
import { loadTopicsWithCounts } from '@/features/topics/queries/load-topics-with-counts';

export const maxDuration = 60;

const mcpHandler = createTreadMcpHandler({
  loadClipBySlug: (slug) => fetchQuery(api.clips.getClipBySlug, { slug }),
  loadClips,
  loadCollectionBySlug,
  loadCollections,
  loadSpeakers,
  loadTalkBySlug,
  loadTalks,
  loadTopicsWithCounts,
});

async function consumeMcpRateLimit(request: Request) {
  const secret = process.env.BETTER_AUTH_SECRET;
  const token = mcpLimiterToken(secret);

  if (!token) {
    return { ok: true, retryAfter: null };
  }

  try {
    return await fetchMutation(api.model.auth.rateLimiter.checkMcp, {
      key: buildMcpRateLimitKey(request, secret),
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
