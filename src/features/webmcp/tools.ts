import type { SpeakerRecord, TalkRecord } from '@/features/mcp/format';
import type { ConvexReactClient } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import type { WebMCP } from 'webmcp-types';

import { site } from '@/configs/site';
import { api } from '@/convex/_generated/api';
import { normalizeSearchQuery } from '@/convex/model/search/helpers';
import { formatTalk } from '@/features/mcp/format';
import { buildSearchPageHref } from '@/features/search/utils';

import { withToolTracking } from './analytics';

type SearchTalks = (args: {
  limit: number;
  search: string;
}) => Promise<{ talks: (TalkRecord & { speaker: SpeakerRecord | null })[] }>;

const SEARCH_LIMIT = 5;
const TALK_PATH = /^\/talks\/(?<speakerSlug>[^/]+)\/(?<talkSlug>[^/]+)$/u;

const talkInput = {
  description:
    'Same-origin talk URL or /talks/<speaker>/<talk> path from search_talks.',
  type: 'string',
} as const;

const talkFlagTools = [
  {
    description:
      'Saves or removes a published talk for the signed-in visitor. Use when the user wants that talk kept or removed from favorites.',
    enabledDescription: 'True saves the talk. False removes it.',
    name: 'set_favorite',
    read: api.users.isTalkFavorited,
    set: api.users.favoriteTalk,
    title: 'Set favorite',
    unset: api.users.unfavoriteTalk,
  },
  {
    description:
      'Records whether the signed-in visitor has finished a published talk. Use when the user wants that talk marked done or not done.',
    enabledDescription: 'True marks the talk finished. False clears the mark.',
    name: 'set_finished',
    read: api.users.isTalkFinished,
    set: api.users.finishTalk,
    title: 'Set finished',
    unset: api.users.unfinishTalk,
  },
] as const;

type TalkQuery = ConvexReactClient['query'];
type TalkMutation = ConvexReactClient['mutation'];

function toolError(code: string, error: string, retryable = false) {
  return { code, error, retryable };
}

function resolveTalkHref(talk: string, origin: string) {
  try {
    const url = new URL(talk.trim(), origin);

    if (url.origin !== origin && url.origin !== new URL(site.url).origin) {
      return toolError('CROSS_ORIGIN', 'Talk URLs must be on this site.');
    }

    const slugs = TALK_PATH.exec(url.pathname);
    const speakerSlug = slugs?.groups?.speakerSlug;
    const talkSlug = slugs?.groups?.talkSlug;

    if (!(speakerSlug && talkSlug)) {
      return toolError('INVALID_TALK', 'That is not a talk on this site.');
    }

    return { href: url.pathname, speakerSlug, talkSlug };
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

          return { href: resolved.href };
        }),
        inputSchema: {
          properties: {
            talk: talkInput,
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

export async function registerSignedInWebMcpTools({
  document: documentLike,
  mutate,
  origin,
  query,
  refreshLists,
  signal,
}: {
  document: { modelContext?: Pick<WebMCP.ModelContext, 'registerTool'> };
  mutate: TalkMutation;
  origin: string;
  query: TalkQuery;
  refreshLists: () => Promise<void>;
  signal: AbortSignal;
}) {
  const { modelContext } = documentLike;

  if (typeof modelContext?.registerTool !== 'function' || signal.aborted) {
    return;
  }

  await Promise.all(
    talkFlagTools.map((tool) =>
      modelContext.registerTool(
        {
          annotations: {
            untrustedContentHint: true,
          },
          description: tool.description,
          execute: withToolTracking(
            tool.name,
            async (input: { enabled?: unknown; talk?: unknown }) => {
              const { enabled, talk } = input;

              if (typeof enabled !== 'boolean' || typeof talk !== 'string') {
                return toolError(
                  'INVALID_INPUT',
                  'Provide a talk on this site and whether the state should be on.'
                );
              }

              const resolved = resolveTalkHref(talk, origin);

              if ('error' in resolved) {
                return resolved;
              }

              let loaded:
                | FunctionReturnType<typeof api.talks.getTalkBySlug>
                | undefined;

              try {
                loaded = await query(api.talks.getTalkBySlug, {
                  speakerSlug: resolved.speakerSlug,
                  talkSlug: resolved.talkSlug,
                });
              } catch {
                return toolError(
                  'TALK_LOOKUP_FAILED',
                  'Could not load that talk. Try again in a moment.',
                  true
                );
              }

              if (!loaded?.talk) {
                return toolError(
                  'NOT_FOUND',
                  'That talk is not available. Use search_talks to find a published talk.'
                );
              }

              const talkId = loaded.talk._id;

              try {
                const current = await query(tool.read, { talkId });

                if (current !== enabled) {
                  await mutate(enabled ? tool.set : tool.unset, { talkId });
                  await refreshLists();
                }
              } catch {
                return toolError(
                  'UPDATE_FAILED',
                  'Could not update that talk. Try again in a moment.',
                  true
                );
              }

              return {
                enabled,
                talk: formatTalk(
                  {
                    ...loaded.talk,
                    topicSlugs: loaded.topics.map((topic) => topic.slug),
                  },
                  loaded.speaker
                ),
              };
            }
          ),
          inputSchema: {
            properties: {
              enabled: {
                description: tool.enabledDescription,
                type: 'boolean',
              },
              talk: talkInput,
            },
            required: ['enabled', 'talk'],
            type: 'object',
          },
          name: tool.name,
          title: tool.title,
        },
        { signal }
      )
    )
  );
}
