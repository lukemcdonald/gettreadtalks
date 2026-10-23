import type { SpeakerRecord, TalkRecord } from './format';

import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';

import { buildClipPath } from '@/features/clips/utils';
import { buildCollectionPath } from '@/features/collections/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildTopicPath } from '@/features/topics/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

import { withToolTracking } from './analytics';
import { formatSpeaker, formatTalk, toIsoDate } from './format';

const DEFAULT_LIST_LIMIT = 50;
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_CURSOR_LENGTH = 2048;
const MAX_LIST_LIMIT = 100;
const MAX_SEARCH_LIMIT = 25;
const MAX_SEARCH_TEXT = 200;

const readOnlyAnnotations = {
  idempotentHint: true,
  openWorldHint: false,
  readOnlyHint: true,
} as const;

const cursorSchema = z
  .string()
  .max(MAX_CURSOR_LENGTH)
  .optional()
  .describe('Pagination cursor from a previous call.');

const searchTextSchema = z.string().max(MAX_SEARCH_TEXT);

const slugSchema = z.string().min(1);

const listLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(MAX_LIST_LIMIT)
  .optional()
  .describe(
    `Maximum items to return (1-${MAX_LIST_LIMIT}, default ${DEFAULT_LIST_LIMIT}).`
  );

const searchLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(MAX_SEARCH_LIMIT)
  .optional()
  .describe(
    `Maximum talks to return (1-${MAX_SEARCH_LIMIT}, default ${DEFAULT_SEARCH_LIMIT}).`
  );

const searchTalksInputSchema = z.object({
  cursor: cursorSchema,
  limit: searchLimitSchema,
  query: searchTextSchema
    .optional()
    .describe('Free-text search across talk titles and speaker names.'),
  speaker: slugSchema
    .optional()
    .describe('Speaker URL slug from list_speakers.'),
  topic: slugSchema.optional().describe('Topic URL slug from list_topics.'),
});

const getTalkInputSchema = z.object({
  speakerSlug: slugSchema.describe('Speaker URL slug from list_speakers.'),
  talkSlug: slugSchema.describe('Talk URL slug from search_talks or get_talk.'),
});

const listSpeakersInputSchema = z.object({
  limit: listLimitSchema,
  search: searchTextSchema.optional().describe('Filter speakers by name.'),
});

const listTopicsInputSchema = z.object({
  search: searchTextSchema.optional().describe('Filter topics by title.'),
});

const listCollectionsInputSchema = z.object({
  limit: listLimitSchema,
});

const getCollectionInputSchema = z.object({
  slug: slugSchema.describe('Collection URL slug from list_collections.'),
});

const listClipsInputSchema = z.object({
  cursor: cursorSchema,
  limit: searchLimitSchema,
  query: searchTextSchema
    .optional()
    .describe('Free-text search across clip titles.'),
  speaker: slugSchema
    .optional()
    .describe('Speaker URL slug from list_speakers.'),
});

const getClipInputSchema = z.object({
  slug: slugSchema.describe('Clip URL slug from list_clips or get_talk.'),
});

interface ClipRecord {
  description?: string;
  publishedAt?: number;
  slug: string;
  title: string;
}

interface CollectionRecord {
  description?: string;
  slug: string;
  title: string;
}

interface TopicRecord {
  description?: string;
  slug: string;
  title: string;
}

export interface McpCatalog {
  loadClipBySlug: (slug: string) => Promise<{
    clip: ClipRecord;
    speaker: SpeakerRecord | null;
    talk: { slug: string; status?: string; title: string } | null;
  } | null>;
  loadClips: (args?: {
    cursor?: string;
    limit?: number;
    search?: string;
    speakerSlugs?: string[];
  }) => Promise<{
    clips: (ClipRecord & { speaker: SpeakerRecord | null })[];
    continueCursor: string;
    isDone: boolean;
  }>;
  loadCollectionBySlug: (slug: string) => Promise<{
    collection: CollectionRecord;
    talks: (TalkRecord & { speaker: SpeakerRecord | null })[];
  } | null>;
  loadCollections: (args?: { limit?: number }) => Promise<{
    collections: {
      collection: CollectionRecord;
      speakers: SpeakerRecord[];
      talkCount: number;
    }[];
  }>;
  loadSpeakers: (args?: { limit?: number; search?: string }) => Promise<{
    speakers: SpeakerRecord[];
  }>;
  loadTalkBySlug: (
    speakerSlug: string,
    talkSlug: string
  ) => Promise<{
    clips: ClipRecord[];
    collection: CollectionRecord | null;
    speaker: SpeakerRecord | null;
    summary: string | null;
    talk: TalkRecord;
    topics: TopicRecord[];
  } | null>;
  loadTalks: (args?: {
    cursor?: string;
    limit?: number;
    search?: string;
    speakerSlugs?: string[];
    topicSlugs?: string[];
  }) => Promise<{
    continueCursor: string;
    isDone: boolean;
    talks: (TalkRecord & { speaker: SpeakerRecord | null })[];
  }>;
  loadTopicsWithCounts: (args?: { search?: string }) => Promise<
    {
      count: number;
      topic: TopicRecord;
    }[]
  >;
}

function toolResult(data: unknown, isError = false) {
  return {
    content: [{ text: JSON.stringify(data), type: 'text' as const }],
    isError,
  };
}

function formatClip(clip: ClipRecord, speaker: SpeakerRecord | null) {
  return {
    description: clip.description,
    publishedAt: toIsoDate(clip.publishedAt),
    slug: clip.slug,
    speaker: speaker ? formatSpeaker(speaker) : null,
    title: clip.title,
    url: buildAbsoluteUrl(buildClipPath(clip)),
  };
}

function formatCollection(collection: CollectionRecord) {
  return {
    description: collection.description,
    slug: collection.slug,
    title: collection.title,
    url: buildAbsoluteUrl(buildCollectionPath(collection)),
  };
}

function formatTopic(topic: TopicRecord, talkCount?: number) {
  return {
    description: topic.description,
    slug: topic.slug,
    talkCount,
    title: topic.title,
    url: buildAbsoluteUrl(buildTopicPath(topic)),
  };
}

export async function searchTalks(
  input: z.infer<typeof searchTalksInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadTalks({
    cursor: input.cursor,
    limit: input.limit ?? DEFAULT_SEARCH_LIMIT,
    search: input.query,
    speakerSlugs: input.speaker ? [input.speaker] : undefined,
    topicSlugs: input.topic ? [input.topic] : undefined,
  });

  return toolResult({
    continueCursor: result.isDone ? undefined : result.continueCursor,
    isDone: result.isDone,
    talks: result.talks.map((talk) => formatTalk(talk, talk.speaker)),
  });
}

export async function loadTalk(
  input: z.infer<typeof getTalkInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadTalkBySlug(
    input.speakerSlug,
    input.talkSlug
  );

  if (!result) {
    return toolResult({ error: 'Talk not found.' }, true);
  }

  return toolResult({
    clips: result.clips.map((clip) => formatClip(clip, result.speaker)),
    collection: result.collection ? formatCollection(result.collection) : null,
    speaker: result.speaker ? formatSpeaker(result.speaker) : null,
    talk: {
      ...formatTalk(
        {
          ...result.talk,
          topicSlugs: result.topics.map((topic) => topic.slug),
        },
        result.speaker
      ),
      summary: result.summary,
    },
    topics: result.topics.map((topic) => formatTopic(topic)),
  });
}

export async function listSpeakers(
  input: z.infer<typeof listSpeakersInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadSpeakers({
    limit: input.limit ?? DEFAULT_LIST_LIMIT,
    search: input.search,
  });

  return toolResult({
    speakers: result.speakers.map(formatSpeaker),
  });
}

export async function listTopics(
  input: z.infer<typeof listTopicsInputSchema>,
  catalog: McpCatalog
) {
  const topics = await catalog.loadTopicsWithCounts({
    search: input.search,
  });

  return toolResult({
    topics: topics.map(({ count, topic }) => formatTopic(topic, count)),
  });
}

export async function listCollections(
  input: z.infer<typeof listCollectionsInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadCollections({
    limit: input.limit ?? DEFAULT_LIST_LIMIT,
  });

  return toolResult({
    collections: result.collections.map(
      ({ collection, speakers, talkCount }) => ({
        ...formatCollection(collection),
        speakerCount: speakers.length,
        talkCount,
      })
    ),
  });
}

export async function loadCollection(
  input: z.infer<typeof getCollectionInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadCollectionBySlug(input.slug);

  if (!result || result.talks.length === 0) {
    return toolResult({ error: 'Collection not found.' }, true);
  }

  return toolResult({
    collection: formatCollection(result.collection),
    talks: result.talks.map((talk) => formatTalk(talk, talk.speaker)),
  });
}

export async function listClips(
  input: z.infer<typeof listClipsInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadClips({
    cursor: input.cursor,
    limit: input.limit ?? DEFAULT_SEARCH_LIMIT,
    search: input.query,
    speakerSlugs: input.speaker ? [input.speaker] : undefined,
  });

  return toolResult({
    clips: result.clips.map((clip) => formatClip(clip, clip.speaker)),
    continueCursor: result.isDone ? undefined : result.continueCursor,
    isDone: result.isDone,
  });
}

export async function loadClip(
  input: z.infer<typeof getClipInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.loadClipBySlug(input.slug);

  if (!result?.talk || result.talk.status !== 'published') {
    return toolResult({ error: 'Clip not found.' }, true);
  }

  return toolResult({
    clip: formatClip(result.clip, result.speaker),
    speaker: result.speaker ? formatSpeaker(result.speaker) : null,
    talk: result.speaker
      ? {
          slug: result.talk.slug,
          title: result.talk.title,
          url: buildAbsoluteUrl(
            buildTalkPath({ speaker: result.speaker, slug: result.talk.slug })
          ),
        }
      : {
          slug: result.talk.slug,
          title: result.talk.title,
        },
  });
}

function registerMcpTools(server: McpServer, catalog: McpCatalog) {
  server.registerTool(
    'search_talks',
    {
      annotations: readOnlyAnnotations,
      description:
        'Search published TREAD talks by text, speaker slug, and/or topic slug. Use list_speakers and list_topics to resolve slugs. Returns canonical gettreadtalks.com URLs.',
      inputSchema: searchTalksInputSchema,
    },
    withToolTracking('search_talks', (input) => searchTalks(input, catalog))
  );

  server.registerTool(
    'get_talk',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one published talk by speaker slug and talk slug. Returns the talk, speaker, topics, collection, and clips with canonical URLs.',
      inputSchema: getTalkInputSchema,
    },
    withToolTracking('get_talk', (input) => loadTalk(input, catalog))
  );

  server.registerTool(
    'list_speakers',
    {
      annotations: readOnlyAnnotations,
      description:
        'List speakers who have published talks or clips. Optional name search. Returns canonical speaker URLs.',
      inputSchema: listSpeakersInputSchema,
    },
    withToolTracking('list_speakers', (input) => listSpeakers(input, catalog))
  );

  server.registerTool(
    'list_topics',
    {
      annotations: readOnlyAnnotations,
      description:
        'List topics that have published talks, with talk counts and canonical topic URLs.',
      inputSchema: listTopicsInputSchema,
    },
    withToolTracking('list_topics', (input) => listTopics(input, catalog))
  );

  server.registerTool(
    'list_collections',
    {
      annotations: readOnlyAnnotations,
      description:
        'List sermon collections that contain published talks. Returns canonical collection URLs.',
      inputSchema: listCollectionsInputSchema,
    },
    withToolTracking('list_collections', (input) =>
      listCollections(input, catalog)
    )
  );

  server.registerTool(
    'get_collection',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one collection by slug, including its published talks and canonical URLs.',
      inputSchema: getCollectionInputSchema,
    },
    withToolTracking('get_collection', (input) =>
      loadCollection(input, catalog)
    )
  );

  server.registerTool(
    'list_clips',
    {
      annotations: readOnlyAnnotations,
      description:
        'List published talk clips, optionally filtered by text or speaker slug. Returns canonical clip URLs.',
      inputSchema: listClipsInputSchema,
    },
    withToolTracking('list_clips', (input) => listClips(input, catalog))
  );

  server.registerTool(
    'get_clip',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one published clip by slug, with its speaker, parent talk, and canonical URL.',
      inputSchema: getClipInputSchema,
    },
    withToolTracking('get_clip', (input) => loadClip(input, catalog))
  );
}

export function createTreadMcpHandler(catalog: McpCatalog) {
  const mcpHandler = createMcpHandler(() => {
    const server = new McpServer(
      {
        name: 'gettreadtalks',
        version: '1.0.0',
      },
      {
        instructions:
          'Public read-only catalog of TREAD Talks at gettreadtalks.com. Prefer search_talks, then get_talk. Always share canonical https://www.gettreadtalks.com URLs. Only published sermons, clips, speakers, topics, and collections are available.',
      }
    );

    registerMcpTools(server, catalog);

    return server;
  });

  return (request: Request) => mcpHandler.fetch(request);
}
