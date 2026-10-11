import type {
  CommandSearchGroup,
  HeaderSearchStatus,
  SearchHit,
  SearchResultType,
  SiteSearchResult,
} from '@/features/search/types';

import { getClipUrl } from '@/features/clips/utils';
import { SEARCH_RESULT_TYPES } from '@/features/search/types';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

export const OPEN_HEADER_SEARCH_EVENT = 'tread:open-header-search';
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_DROPDOWN_LIMIT = 4;
export const SEARCH_PAGE_LIMIT = 12;
export const VIEW_ALL_SEARCH_GROUP = 'view-all';

export const emptySiteSearch: SiteSearchResult = {
  clips: [],
  speakers: [],
  talks: [],
  topics: [],
};

const SEARCH_GROUP_LABELS: Record<SearchResultType, string> = {
  clip: 'Clips',
  speaker: 'Speakers',
  talk: 'Talks',
  topic: 'Topics',
};

function getSearchGroupLabel(type: SearchResultType) {
  return SEARCH_GROUP_LABELS[type];
}

export function getSearchHotkeyLabel(userAgent = '') {
  return /Mac|iPhone|iPad|iPod/u.test(userAgent) ? '⌘K' : 'Ctrl K';
}

export function getHeaderSearchStatus({
  hasQuery,
  hasResults,
  isLoading,
}: {
  hasQuery: boolean;
  hasResults: boolean;
  isLoading: boolean;
}): HeaderSearchStatus {
  if (!hasQuery) {
    return 'idle';
  }

  if (isLoading) {
    return 'loading';
  }

  if (hasResults) {
    return 'results';
  }

  return 'empty';
}

export function isSearchHotkey(event: {
  altKey: boolean;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  repeat?: boolean;
  shiftKey: boolean;
}) {
  if (event.altKey || event.shiftKey || event.repeat) {
    return false;
  }

  if (!(event.metaKey || event.ctrlKey)) {
    return false;
  }

  return event.key.toLowerCase() === 'k';
}

export function getHeaderSearchQueryAfterClose(
  query: string,
  didNavigate: boolean
) {
  return didNavigate ? '' : query;
}

export function openHeaderSearch() {
  window.dispatchEvent(new Event(OPEN_HEADER_SEARCH_EVENT));
}

export function getSearchQuery(search?: string | string[]) {
  const value = Array.isArray(search) ? search[0] : search;

  return value?.trim() ?? '';
}

export function getSearchPageHref(query: string) {
  const params = new URLSearchParams({ search: query });

  return `/search?${params.toString()}`;
}

export function toSearchHits(result: SiteSearchResult): SearchHit[] {
  const talks = result.talks.flatMap((talk) => {
    if (!talk.speaker) {
      return [];
    }

    return [
      {
        href: getTalkUrl(talk.speaker.slug, talk.slug),
        id: talk._id,
        subtitle: getSpeakerName(talk.speaker),
        title: talk.title,
        type: 'talk' as const,
      },
    ];
  });

  const speakers = result.speakers.map((speaker) => ({
    href: `/speakers/${speaker.slug}`,
    id: speaker._id,
    subtitle: speaker.ministry,
    title: getSpeakerName(speaker),
    type: 'speaker' as const,
  }));

  const topics = result.topics.map((topic) => ({
    href: `/topics/${topic.slug}`,
    id: topic._id,
    title: topic.title,
    type: 'topic' as const,
  }));

  const clips = result.clips.map((clip) => ({
    href: getClipUrl(clip.slug),
    id: clip._id,
    subtitle: getSpeakerName(clip.speaker),
    title: clip.title,
    type: 'clip' as const,
  }));

  return [...talks, ...speakers, ...topics, ...clips];
}

export function groupSearchHits(hits: SearchHit[]) {
  return SEARCH_RESULT_TYPES.map((type) => ({
    hits: hits.filter((hit) => hit.type === type),
    label: getSearchGroupLabel(type),
    type,
  })).filter((group) => group.hits.length > 0);
}

export function toCommandGroups(
  hits: SearchHit[],
  query: string
): CommandSearchGroup[] {
  const groups = groupSearchHits(hits).map((group) => ({
    items: group.hits.map((hit) => ({
      href: hit.href,
      label: hit.title,
      subtitle: hit.subtitle,
      value: hit.id,
    })),
    value: group.label,
  }));
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return groups;
  }

  return [
    ...groups,
    {
      items: [
        {
          href: getSearchPageHref(trimmedQuery),
          label: 'View all results',
          value: VIEW_ALL_SEARCH_GROUP,
        },
      ],
      value: VIEW_ALL_SEARCH_GROUP,
    },
  ];
}

export function hasSearchHits(result: SiteSearchResult) {
  return toSearchHits(result).length > 0;
}
