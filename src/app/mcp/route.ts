import { fetchMutation, fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getClips } from '@/features/clips/queries/get-clips';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';
import { getCollections } from '@/features/collections/queries/get-collections';
import { createTreadMcpHandler } from '@/features/mcp/tools';
import { getSpeakers } from '@/features/speakers/queries/get-speakers';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';
import { getTalks } from '@/features/talks/queries/get-talks';
import { getTopicsWithCounts } from '@/features/topics/queries/get-topics-with-counts';

export const maxDuration = 60;

const MCP_CORS_HEADERS = {
  'Access-Control-Allow-Headers':
    'Accept, Authorization, Content-Type, Last-Event-ID, MCP-Protocol-Version, MCP-Session-Id',
  'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, POST',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'MCP-Session-Id, WWW-Authenticate',
  'Access-Control-Max-Age': '86400',
};

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

function withCors(response: Response) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(MCP_CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');

  return (
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  );
}

async function consumeMcpRateLimit(request: Request) {
  try {
    return await fetchMutation(api.model.auth.rateLimiter.checkMcp, {
      key: clientKey(request),
    });
  } catch {
    return { ok: true, retryAfter: null };
  }
}

async function handleMcpRequest(request: Request) {
  const limit = await consumeMcpRateLimit(request);

  if (!limit.ok) {
    const retryAfterSeconds = Math.ceil((limit.retryAfter ?? 60_000) / 1000);

    return withCors(
      Response.json(
        { error: 'Rate limit exceeded' },
        {
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
          status: 429,
        }
      )
    );
  }

  return withCors(await mcpHandler(request));
}

export function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export {
  handleMcpRequest as DELETE,
  handleMcpRequest as GET,
  handleMcpRequest as POST,
};
