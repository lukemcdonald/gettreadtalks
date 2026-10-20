import type { SiteSearchResult } from '@/features/search/types';
import type { WebMCP } from 'webmcp-types';

import { openTalkForAgent, searchTalksForAgent } from '@/features/webmcp/tools';

const OPEN_TALK_INPUT_SCHEMA = {
  properties: {
    talk: {
      description:
        'Talk URL, path, or speaker-slug/talk-slug from search_talks.',
      type: 'string',
    },
  },
  required: ['talk'],
  type: 'object',
} as const;

const SEARCH_TALKS_INPUT_SCHEMA = {
  properties: {
    query: {
      description: 'Words to find in talk titles and speaker names.',
      type: 'string',
    },
  },
  required: ['query'],
  type: 'object',
} as const;

function hasModelContext(documentLike: {
  modelContext?: {
    registerTool?: unknown;
  };
}) {
  return typeof documentLike.modelContext?.registerTool === 'function';
}

async function registerWebMcpTools({
  modelContext,
  navigate,
  origin,
  searchSite,
  signal,
}: {
  modelContext: WebMCP.ModelContext;
  navigate: (href: string) => void;
  origin: string;
  searchSite: (args: {
    limit?: number;
    query: string;
  }) => Promise<SiteSearchResult>;
  signal: AbortSignal;
}) {
  const searchTalksTool = {
    annotations: {
      untrustedContentHint: true,
    },
    description:
      'Searches published talks and opens the site search with the same query. Use when the user wants to find sermons by title, speaker, or topic.',
    execute: (
      input: { query?: string },
      { signal: executeSignal }: { signal: AbortSignal }
    ) =>
      searchTalksForAgent({
        navigate,
        origin,
        query: input.query ?? '',
        searchSite,
        signal: executeSignal,
      }),
    inputSchema: SEARCH_TALKS_INPUT_SCHEMA,
    name: 'search_talks',
    title: 'Search talks',
  };

  const openTalkTool = {
    description:
      'Opens a published talk on this site. Use when the user is ready to view a specific talk from search results or a known URL.',
    execute: (input: { talk?: string }) => {
      if (!input.talk?.trim()) {
        return {
          code: 'INVALID_TALK',
          error: 'A talk URL or slug is required.',
          retryable: false,
          suggestion: 'Pass a talk URL from search_talks.',
        };
      }

      return openTalkForAgent({
        navigate,
        origin,
        talk: input.talk,
      });
    },
    inputSchema: OPEN_TALK_INPUT_SCHEMA,
    name: 'open_talk',
    title: 'Open talk',
  };

  await Promise.all([
    modelContext.registerTool(searchTalksTool, { signal }),
    modelContext.registerTool(openTalkTool, { signal }),
  ]);
}

export async function registerDocumentWebMcpTools({
  document: documentLike,
  navigate,
  origin,
  searchSite,
  signal,
}: {
  document: {
    modelContext?: WebMCP.ModelContext;
  };
  navigate: (href: string) => void;
  origin: string;
  searchSite: (args: {
    limit?: number;
    query: string;
  }) => Promise<SiteSearchResult>;
  signal: AbortSignal;
}) {
  if (!hasModelContext(documentLike) || !documentLike.modelContext) {
    return;
  }

  await registerWebMcpTools({
    modelContext: documentLike.modelContext,
    navigate,
    origin,
    searchSite,
    signal,
  });
}
