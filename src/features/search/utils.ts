import type {
  CommandSearchGroup,
  CommandSearchItem,
  HeaderSearchStatus,
  SearchHit,
  SearchResultType,
  SiteSearchResult,
} from '@/features/search/types';

import { NAVIGATION_LINKS } from '@/components/site-header/constants';
import { buildClipUrl } from '@/features/clips/utils';
import { SEARCH_RESULT_TYPES } from '@/features/search/types';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkUrl } from '@/features/talks/utils';

export const BROWSE_SEARCH_GROUP = 'Browse';
const FAVORITES_SEARCH_HREF = '/account/favorites';
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

function formatSearchGroupLabel(type: SearchResultType) {
  return SEARCH_GROUP_LABELS[type];
}

export function formatSearchHotkeyLabel(userAgent = '') {
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

export function buildSearchPageHref(query: string) {
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
        href: buildTalkUrl(talk.speaker.slug, talk.slug),
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
    href: buildClipUrl(clip.slug),
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
    label: formatSearchGroupLabel(type),
    type,
  })).filter((group) => group.hits.length > 0);
}

export function getBrowseCommandGroups(
  isSignedIn: boolean
): CommandSearchGroup[] {
  const items: CommandSearchItem[] = NAVIGATION_LINKS.map((link) => ({
    href: link.href,
    label: link.label,
    value: `browse-${link.href.slice(1)}`,
  }));

  if (isSignedIn) {
    items.push({
      href: FAVORITES_SEARCH_HREF,
      label: 'Favorites',
      value: 'browse-favorites',
    });
  }

  return [
    {
      items,
      value: BROWSE_SEARCH_GROUP,
    },
  ];
}

export function getHeaderSearchState({
  hits,
  isPending,
  isSignedIn,
  previousHits,
  value,
}: {
  hits: SearchHit[];
  isPending: boolean;
  isSignedIn: boolean;
  previousHits: SearchHit[] | null;
  value: string;
}): { groups: CommandSearchGroup[]; status: HeaderSearchStatus } {
  if (!value.trim()) {
    return {
      groups: getBrowseCommandGroups(isSignedIn),
      status: 'idle',
    };
  }

  if (isPending) {
    if (previousHits === null) {
      return {
        groups: getBrowseCommandGroups(isSignedIn),
        status: 'loading',
      };
    }

    if (previousHits.length > 0) {
      return {
        groups: toCommandGroups(previousHits, ''),
        status: 'loading',
      };
    }

    return {
      groups: [],
      status: 'empty',
    };
  }

  if (hits.length > 0) {
    return {
      groups: toCommandGroups(hits, value),
      status: 'results',
    };
  }

  return {
    groups: [],
    status: 'empty',
  };
}

export function shouldShowViewAllResults(
  hits: SearchHit[],
  limit = SEARCH_DROPDOWN_LIMIT
) {
  return groupSearchHits(hits).some((group) => group.hits.length >= limit);
}

export function getSearchSelectionAnalytics({
  hits,
  itemValue,
  query,
}: {
  hits: SearchHit[];
  itemValue: string;
  query: string;
}) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return null;
  }

  if (itemValue === VIEW_ALL_SEARCH_GROUP) {
    return {
      position: hits.length + 1,
      query: trimmedQuery,
      result_type: 'view_all' as const,
    };
  }

  const position = hits.findIndex((hit) => hit.id === itemValue);

  if (position === -1) {
    return null;
  }

  const hit = hits[position];

  if (!hit) {
    return null;
  }

  return {
    position: position + 1,
    query: trimmedQuery,
    result_type: hit.type,
  };
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

  if (!trimmedQuery || groups.length === 0 || !shouldShowViewAllResults(hits)) {
    return groups;
  }

  return [
    ...groups,
    {
      items: [
        {
          href: buildSearchPageHref(trimmedQuery),
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
