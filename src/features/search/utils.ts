import type {
  SearchHit,
  SearchResultType,
  SiteSearchResult,
} from '@/features/search/types';

import { getClipUrl } from '@/features/clips/utils';
import { SEARCH_RESULT_TYPES } from '@/features/search/types';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_DROPDOWN_LIMIT = 4;
export const SEARCH_PAGE_LIMIT = 12;

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

export function getNextActiveIndex(
  current: number,
  delta: number,
  length: number
) {
  if (length === 0) {
    return -1;
  }

  if (delta > 0) {
    return (current + 1) % length;
  }

  if (current <= 0) {
    return length - 1;
  }

  return current - 1;
}

export function getSearchInputAction(key: string, hasActiveHit: boolean) {
  if (key === 'ArrowDown') {
    return 'next';
  }

  if (key === 'ArrowUp') {
    return 'previous';
  }

  if (key === 'Enter' && hasActiveHit) {
    return 'select';
  }

  if (key === 'Escape') {
    return 'close';
  }

  return null;
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

export function hasSearchHits(result: SiteSearchResult) {
  return toSearchHits(result).length > 0;
}
