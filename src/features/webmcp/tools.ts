import type { SiteSearchResult } from '@/features/search/types';

import { normalizeSearchQuery } from '@/convex/model/search/utils';
import {
  buildSearchPageHref,
  SEARCH_PAGE_LIMIT,
} from '@/features/search/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';

export const WEBMCP_OUTPUT_MAX_CHARS = 1500;
export const WEBMCP_SEARCH_PAGE_SIZE = 5;
export const WEBMCP_SEARCH_QUERY_MAX = 200;

export interface WebMcpToolError {
  code: string;
  error: string;
  retryable: boolean;
  suggestion?: string;
}

export interface WebMcpTalkResult {
  scripture?: string;
  speaker: string;
  title: string;
  url: string;
}

export interface WebMcpSearchTalksResult {
  page_size: number;
  suggestion?: string;
  talks: WebMcpTalkResult[];
  total_count: number;
}

function isWebMcpToolError(
  value: { href: string } | WebMcpToolError
): value is WebMcpToolError {
  return 'error' in value;
}

function invalidTalkError(): WebMcpToolError {
  return {
    code: 'INVALID_TALK',
    error: 'That is not a talk on this site.',
    retryable: false,
    suggestion:
      'Use a talk URL from search_talks, a /talks/... path, or speaker-slug/talk-slug.',
  };
}

export function toTalkPath(
  talk: string,
  origin: string
): { href: string } | WebMcpToolError {
  const trimmed = talk.trim();

  if (!trimmed) {
    return invalidTalkError();
  }

  let url: URL;

  try {
    if (trimmed.startsWith('//')) {
      url = new URL(`https:${trimmed}`);
    } else if (trimmed.includes('://')) {
      url = new URL(trimmed);
    } else if (trimmed.startsWith('/')) {
      url = new URL(trimmed, origin);
    } else {
      url = new URL(`/talks/${trimmed}`, origin);
    }
  } catch {
    return invalidTalkError();
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return invalidTalkError();
  }

  if (url.origin !== origin) {
    return {
      code: 'CROSS_ORIGIN',
      error: 'Talk URLs must be on this site.',
      retryable: false,
      suggestion: 'Use a path or URL from search_talks on this page.',
    };
  }

  const pathname = url.pathname.replace(/\/+$/u, '') || '/';
  const segments = pathname.split('/').filter(Boolean);

  if (
    segments[0] !== 'talks' ||
    segments.length < 2 ||
    segments.length > 3 ||
    segments.some((segment) => segment === '.' || segment === '..')
  ) {
    return invalidTalkError();
  }

  return { href: pathname };
}

export function toSearchTalkResults(
  result: SiteSearchResult,
  origin: string
): WebMcpSearchTalksResult {
  const talks = result.talks.flatMap((talk) => {
    if (!talk.speaker) {
      return [];
    }

    return [
      {
        ...(talk.scripture ? { scripture: talk.scripture } : {}),
        speaker: getSpeakerName(talk.speaker),
        title: talk.title,
        url: `${origin}${buildTalkPath(talk)}`,
      },
    ];
  });

  return capSearchTalkResults({
    page_size: WEBMCP_SEARCH_PAGE_SIZE,
    ...(talks.length === 0
      ? {
          suggestion:
            'Try a speaker name, a shorter phrase, or a scripture book.',
        }
      : {}),
    talks: talks.slice(0, WEBMCP_SEARCH_PAGE_SIZE),
    total_count: talks.length,
  });
}

function capSearchTalkResults(
  payload: WebMcpSearchTalksResult
): WebMcpSearchTalksResult {
  const talks = [...payload.talks];

  while (
    talks.length > 1 &&
    JSON.stringify({ ...payload, talks }).length > WEBMCP_OUTPUT_MAX_CHARS
  ) {
    talks.pop();
  }

  return {
    ...payload,
    talks,
  };
}

export async function searchTalksForAgent({
  navigate,
  origin,
  query,
  searchSite,
  signal,
}: {
  navigate: (href: string) => void;
  origin: string;
  query: string;
  searchSite: (args: {
    limit?: number;
    query: string;
  }) => Promise<SiteSearchResult>;
  signal: AbortSignal;
}): Promise<WebMcpSearchTalksResult | WebMcpToolError> {
  if (signal.aborted) {
    return {
      code: 'CANCELLED',
      error: 'Search was cancelled.',
      retryable: false,
    };
  }

  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return {
      code: 'INVALID_QUERY',
      error: 'A search query is required.',
      retryable: false,
      suggestion: 'Ask the user what talk, speaker, or topic to find.',
    };
  }

  if (normalizedQuery.length > WEBMCP_SEARCH_QUERY_MAX) {
    return {
      code: 'INVALID_QUERY',
      error: 'That search is too long.',
      retryable: false,
      suggestion: 'Use a shorter phrase.',
    };
  }

  const href = buildSearchPageHref(normalizedQuery);
  navigate(href);

  try {
    const result = await searchSite({
      limit: SEARCH_PAGE_LIMIT,
      query: normalizedQuery,
    });

    if (signal.aborted) {
      return {
        code: 'CANCELLED',
        error: 'Search was cancelled.',
        retryable: false,
      };
    }

    return toSearchTalkResults(result, origin);
  } catch {
    return {
      code: 'SEARCH_FAILED',
      error: 'Talk search failed. Try again in a moment.',
      retryable: true,
    };
  }
}

export function openTalkForAgent({
  navigate,
  origin,
  talk,
}: {
  navigate: (href: string) => void;
  origin: string;
  talk: string;
}): { href: string } | WebMcpToolError {
  const resolved = toTalkPath(talk, origin);

  if (isWebMcpToolError(resolved)) {
    return resolved;
  }

  navigate(resolved.href);

  return { href: resolved.href };
}
