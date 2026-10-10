import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';

import { site } from '@/configs/site';
import { getClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

const DEFAULT_LIST_LIMIT = 50;
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_CURSOR_LENGTH = 2048;
const MAX_LIST_LIMIT = 100;
const MAX_SEARCH_LIMIT = 25;
const MAX_SEARCH_TEXT = 200;
const MAX_SLUG_LENGTH = 120;

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

const slugSchema = z.string().min(1).max(MAX_SLUG_LENGTH);

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

interface SpeakerRecord {
  description?: string;
  firstName: string;
  lastName: string;
  ministry?: string;
  slug: string;
}

interface TalkRecord {
  description?: string;
  publishedAt?: number;
  scripture?: string;
  slug: string;
  title: string;
  topicSlugs?: string[];
}

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
  slug: string;
  title: string;
}

export interface McpCatalog {
  getClipBySlug: (slug: string) => Promise<{
    clip: ClipRecord;
    speaker: SpeakerRecord | null;
    talk: { slug: string; status?: string; title: string } | null;
  } | null>;
  getClips: (args?: {
    cursor?: string;
    limit?: number;
    search?: string;
    speakerSlugs?: string[];
  }) => Promise<{
    clips: (ClipRecord & { speaker: SpeakerRecord | null })[];
    continueCursor: string;
    isDone: boolean;
  }>;
  getCollectionBySlug: (slug: string) => Promise<{
    collection: CollectionRecord;
    talks: (TalkRecord & { speaker: SpeakerRecord | null })[];
  } | null>;
  getCollections: (args?: { limit?: number }) => Promise<{
    collections: {
      collection: CollectionRecord;
      speakers: SpeakerRecord[];
      talkCount: number;
    }[];
  }>;
  getSpeakers: (args?: { limit?: number; search?: string }) => Promise<{
    speakers: SpeakerRecord[];
  }>;
  getTalkBySlug: (
    speakerSlug: string,
    talkSlug: string
  ) => Promise<{
    clips: ClipRecord[];
    collection: CollectionRecord | null;
    speaker: SpeakerRecord | null;
    talk: TalkRecord;
    topics: TopicRecord[];
  } | null>;
  getTalks: (args?: {
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
  getTopicsWithCounts: (args?: { search?: string }) => Promise<
    {
      count: number;
      topic: TopicRecord;
    }[]
  >;
}

function canonicalUrl(path: string) {
  return `${site.url}${path}`;
}

function toIsoDate(timestamp?: number) {
  if (!timestamp) {
    return;
  }

  return new Date(timestamp).toISOString();
}

function toolResult(data: unknown, isError = false) {
  return {
    content: [{ text: JSON.stringify(data), type: 'text' as const }],
    isError,
  };
}

function formatSpeaker(speaker: SpeakerRecord) {
  return {
    ministry: speaker.ministry,
    name: getSpeakerName(speaker),
    slug: speaker.slug,
    url: canonicalUrl(`/speakers/${speaker.slug}`),
  };
}

function formatTalk(talk: TalkRecord, speaker: SpeakerRecord | null) {
  return {
    description: talk.description,
    publishedAt: toIsoDate(talk.publishedAt),
    scripture: talk.scripture,
    slug: talk.slug,
    speaker: speaker ? formatSpeaker(speaker) : null,
    title: talk.title,
    topics: talk.topicSlugs,
    url: speaker
      ? canonicalUrl(getTalkUrl(speaker.slug, talk.slug))
      : undefined,
  };
}

function formatClip(clip: ClipRecord, speaker: SpeakerRecord | null) {
  return {
    description: clip.description,
    publishedAt: toIsoDate(clip.publishedAt),
    slug: clip.slug,
    speaker: speaker ? formatSpeaker(speaker) : null,
    title: clip.title,
    url: canonicalUrl(getClipUrl(clip.slug)),
  };
}

function formatCollection(collection: CollectionRecord) {
  return {
    description: collection.description,
    slug: collection.slug,
    title: collection.title,
    url: canonicalUrl(`/collections/${collection.slug}`),
  };
}

function formatTopic(topic: TopicRecord, talkCount?: number) {
  return {
    slug: topic.slug,
    talkCount,
    title: topic.title,
    url: canonicalUrl(`/topics/${topic.slug}`),
  };
}

export async function searchTalks(
  input: z.infer<typeof searchTalksInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.getTalks({
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

export async function getTalk(
  input: z.infer<typeof getTalkInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.getTalkBySlug(input.speakerSlug, input.talkSlug);

  if (!result) {
    return toolResult({ error: 'Talk not found.' }, true);
  }

  return toolResult({
    clips: result.clips.map((clip) => formatClip(clip, result.speaker)),
    collection: result.collection ? formatCollection(result.collection) : null,
    speaker: result.speaker ? formatSpeaker(result.speaker) : null,
    talk: formatTalk(
      {
        ...result.talk,
        topicSlugs: result.topics.map((topic) => topic.slug),
      },
      result.speaker
    ),
    topics: result.topics.map((topic) => formatTopic(topic)),
  });
}

export async function listSpeakers(
  input: z.infer<typeof listSpeakersInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.getSpeakers({
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
  const topics = await catalog.getTopicsWithCounts({
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
  const result = await catalog.getCollections({
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

export async function getCollection(
  input: z.infer<typeof getCollectionInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.getCollectionBySlug(input.slug);

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
  const result = await catalog.getClips({
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

export async function getClip(
  input: z.infer<typeof getClipInputSchema>,
  catalog: McpCatalog
) {
  const result = await catalog.getClipBySlug(input.slug);

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
          url: canonicalUrl(getTalkUrl(result.speaker.slug, result.talk.slug)),
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
    (input) => searchTalks(input, catalog)
  );

  server.registerTool(
    'get_talk',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one published talk by speaker slug and talk slug. Returns the talk, speaker, topics, collection, and clips with canonical URLs.',
      inputSchema: getTalkInputSchema,
    },
    (input) => getTalk(input, catalog)
  );

  server.registerTool(
    'list_speakers',
    {
      annotations: readOnlyAnnotations,
      description:
        'List speakers who have published talks or clips. Optional name search. Returns canonical speaker URLs.',
      inputSchema: listSpeakersInputSchema,
    },
    (input) => listSpeakers(input, catalog)
  );

  server.registerTool(
    'list_topics',
    {
      annotations: readOnlyAnnotations,
      description:
        'List topics that have published talks, with talk counts and canonical topic URLs.',
      inputSchema: listTopicsInputSchema,
    },
    (input) => listTopics(input, catalog)
  );

  server.registerTool(
    'list_collections',
    {
      annotations: readOnlyAnnotations,
      description:
        'List sermon collections that contain published talks. Returns canonical collection URLs.',
      inputSchema: listCollectionsInputSchema,
    },
    (input) => listCollections(input, catalog)
  );

  server.registerTool(
    'get_collection',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one collection by slug, including its published talks and canonical URLs.',
      inputSchema: getCollectionInputSchema,
    },
    (input) => getCollection(input, catalog)
  );

  server.registerTool(
    'list_clips',
    {
      annotations: readOnlyAnnotations,
      description:
        'List published talk clips, optionally filtered by text or speaker slug. Returns canonical clip URLs.',
      inputSchema: listClipsInputSchema,
    },
    (input) => listClips(input, catalog)
  );

  server.registerTool(
    'get_clip',
    {
      annotations: readOnlyAnnotations,
      description:
        'Get one published clip by slug, with its speaker, parent talk, and canonical URL.',
      inputSchema: getClipInputSchema,
    },
    (input) => getClip(input, catalog)
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
