import type { SpeakerRecord, TalkRecord } from '@/features/mcp/format';
import type { ConvexReactClient } from 'convex/react';
import type { WebMCP } from 'webmcp-types';

import { site } from '@/configs/site';
import { api } from '@/convex/_generated/api';
import { normalizeSearchQuery } from '@/convex/model/search/utils';
import { formatTalk } from '@/features/mcp/format';
import { buildSearchPageHref } from '@/features/search/utils';

import { withToolTracking } from './analytics';

type SearchTalks = (args: {
  limit: number;
  search: string;
}) => Promise<{ talks: (TalkRecord & { speaker: SpeakerRecord | null })[] }>;

const SEARCH_LIMIT = 5;
const TALK_PATH = /^\/talks\/[^/]+\/[^/]+$/u;

function toolError(code: string, error: string, retryable = false) {
  return { code, error, retryable };
}

function resolveTalkHref(talk: string, origin: string) {
  try {
    const url = new URL(talk.trim(), origin);

    if (url.origin !== origin && url.origin !== new URL(site.url).origin) {
      return toolError('CROSS_ORIGIN', 'Talk URLs must be on this site.');
    }

    if (!TALK_PATH.test(url.pathname)) {
      return toolError('INVALID_TALK', 'That is not a talk on this site.');
    }

    return { href: url.pathname };
  } catch {
    return toolError('INVALID_TALK', 'That is not a talk on this site.');
  }
}

export function createSearchTalks(
  query: ConvexReactClient['query']
): SearchTalks {
  return async ({ limit, search }) => {
    const result = await query(api.talks.listTalks, {
      paginationOpts: { cursor: null, numItems: limit },
      search,
      sort: 'recent',
    });

    return { talks: result.page };
  };
}

export async function registerWebMcpTools({
  document: documentLike,
  navigate,
  origin,
  searchTalks,
  signal,
}: {
  document: { modelContext?: Pick<WebMCP.ModelContext, 'registerTool'> };
  navigate: (href: string) => void;
  origin: string;
  searchTalks: SearchTalks;
  signal: AbortSignal;
}) {
  const { modelContext } = documentLike;

  if (typeof modelContext?.registerTool !== 'function') {
    return;
  }

  await Promise.all([
    modelContext.registerTool(
      {
        annotations: {
          untrustedContentHint: true,
        },
        description:
          'Searches published talks by title or speaker and opens the site search. Use when the user wants to find a sermon.',
        execute: withToolTracking(
          'search_talks',
          async ({ query }: { query: string }) => {
            const normalizedQuery = normalizeSearchQuery(query);

            if (!normalizedQuery) {
              return toolError('INVALID_QUERY', 'A search query is required.');
            }

            navigate(buildSearchPageHref(normalizedQuery));

            try {
              const { talks } = await searchTalks({
                limit: SEARCH_LIMIT,
                search: normalizedQuery,
              });
              const formatted = talks.map((talk) =>
                formatTalk(talk, talk.speaker)
              );

              if (formatted.length === 0) {
                return {
                  suggestion: 'Try a speaker name or a shorter phrase.',
                  talks: formatted,
                };
              }

              return { talks: formatted };
            } catch {
              return toolError(
                'SEARCH_FAILED',
                'Talk search failed. Try again in a moment.',
                true
              );
            }
          }
        ),
        inputSchema: {
          properties: {
            query: {
              description: 'Words in a talk title or speaker name.',
              type: 'string',
            },
          },
          required: ['query'],
          type: 'object',
        },
        name: 'search_talks',
        title: 'Search talks',
      },
      { signal }
    ),
    modelContext.registerTool(
      {
        description:
          'Opens a published talk on this site. Use when the user is ready to view a talk from search_talks.',
        execute: withToolTracking('open_talk', ({ talk }: { talk: string }) => {
          const resolved = resolveTalkHref(talk, origin);

          if ('error' in resolved) {
            return resolved;
          }

          navigate(resolved.href);

          return resolved;
        }),
        inputSchema: {
          properties: {
            talk: {
              description:
                'Same-origin talk URL or /talks/<speaker>/<talk> path from search_talks.',
              type: 'string',
            },
          },
          required: ['talk'],
          type: 'object',
        },
        name: 'open_talk',
        title: 'Open talk',
      },
      { signal }
    ),
  ]);
}
