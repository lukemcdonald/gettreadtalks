import type { Id } from '@/convex/_generated/dataModel';
import type { SpeakerRecord, TalkRecord } from '@/features/mcp/format';
import type { ConvexReactClient } from 'convex/react';
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
    flag: 'favorite',
    name: 'set_favorite',
    title: 'Set favorite',
  },
  {
    description:
      'Records whether the signed-in visitor has finished a published talk. Use when the user wants that talk marked done or not done.',
    enabledDescription: 'True marks the talk finished. False clears the mark.',
    flag: 'finished',
    name: 'set_finished',
    title: 'Set finished',
  },
] as const;

type TalkFlag = (typeof talkFlagTools)[number]['flag'];
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

async function loadPublishedTalk(
  query: TalkQuery,
  speakerSlug: string,
  talkSlug: string
) {
  const result = await query(api.talks.getTalkBySlug, {
    speakerSlug,
    talkSlug,
  });

  if (!result?.talk) {
    return null;
  }

  return {
    speaker: result.speaker
      ? {
          firstName: result.speaker.firstName,
          lastName: result.speaker.lastName,
          ministry: result.speaker.ministry,
          slug: result.speaker.slug,
        }
      : null,
    talk: {
      id: result.talk._id,
      publishedAt: result.talk.publishedAt,
      scripture: result.talk.scripture,
      slug: result.talk.slug,
      title: result.talk.title,
      topicSlugs: result.topics.map((topic) => topic.slug),
    },
  };
}

function readTalkFlag(query: TalkQuery, flag: TalkFlag, talkId: Id<'talks'>) {
  if (flag === 'favorite') {
    return query(api.users.isTalkFavorited, { talkId });
  }

  return query(api.users.isTalkFinished, { talkId });
}

function writeTalkFlag(
  mutate: TalkMutation,
  flag: TalkFlag,
  talkId: Id<'talks'>,
  enabled: boolean
) {
  if (flag === 'favorite') {
    if (enabled) {
      return mutate(api.users.favoriteTalk, { talkId });
    }

    return mutate(api.users.unfavoriteTalk, { talkId });
  }

  if (enabled) {
    return mutate(api.users.finishTalk, { talkId });
  }

  return mutate(api.users.unfinishTalk, { talkId });
}

function resolveTalkTarget(talk: string, origin: string) {
  const resolved = resolveTalkHref(talk, origin);

  if ('error' in resolved) {
    return resolved;
  }

  const slugs = TALK_PATH.exec(resolved.href);
  const speakerSlug = slugs?.groups?.speakerSlug;
  const talkSlug = slugs?.groups?.talkSlug;

  if (!(speakerSlug && talkSlug)) {
    return toolError('INVALID_TALK', 'That is not a talk on this site.');
  }

  return { speakerSlug, talkSlug };
}

async function loadTalkForFlag(query: TalkQuery, talk: string, origin: string) {
  const target = resolveTalkTarget(talk, origin);

  if ('error' in target) {
    return target;
  }

  try {
    const loaded = await loadPublishedTalk(
      query,
      target.speakerSlug,
      target.talkSlug
    );

    if (!loaded) {
      return toolError(
        'NOT_FOUND',
        'That talk is not available. Use search_talks to find a published talk.'
      );
    }

    return loaded;
  } catch {
    return toolError(
      'TALK_LOOKUP_FAILED',
      'Could not load that talk. Try again in a moment.',
      true
    );
  }
}

async function commitTalkFlag({
  enabled,
  flag,
  mutate,
  query,
  refreshLists,
  talkId,
}: {
  enabled: boolean;
  flag: TalkFlag;
  mutate: TalkMutation;
  query: TalkQuery;
  refreshLists: () => Promise<void>;
  talkId: Id<'talks'>;
}) {
  const current = await readTalkFlag(query, flag, talkId);

  if (current === enabled) {
    return;
  }

  await writeTalkFlag(mutate, flag, talkId, enabled);
  await refreshLists();
}

async function setTalkFlag({
  enabled,
  flag,
  mutate,
  origin,
  query,
  refreshLists,
  talk,
}: {
  enabled: unknown;
  flag: TalkFlag;
  mutate: TalkMutation;
  origin: string;
  query: TalkQuery;
  refreshLists: () => Promise<void>;
  talk: unknown;
}) {
  if (typeof enabled !== 'boolean' || typeof talk !== 'string') {
    return toolError(
      'INVALID_INPUT',
      'Provide a talk on this site and whether the state should be on.'
    );
  }

  const loaded = await loadTalkForFlag(query, talk, origin);

  if ('error' in loaded) {
    return loaded;
  }

  try {
    await commitTalkFlag({
      enabled,
      flag,
      mutate,
      query,
      refreshLists,
      talkId: loaded.talk.id,
    });
  } catch {
    return toolError(
      'UPDATE_FAILED',
      'Could not update that talk. Try again in a moment.',
      true
    );
  }

  return {
    enabled,
    talk: formatTalk(loaded.talk, loaded.speaker),
  };
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
            (input: { enabled?: unknown; talk?: unknown }) =>
              setTalkFlag({
                enabled: input.enabled,
                flag: tool.flag,
                mutate,
                origin,
                query,
                refreshLists,
                talk: input.talk,
              })
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
