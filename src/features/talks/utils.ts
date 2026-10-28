import type { Speaker } from '@/features/speakers/types';
import type { Talk, TalkId } from '@/features/talks/types';

import { site } from '@/configs/site';
import { TRANSCRIPT_FETCH_ERROR_CODES } from '@/convex/model/talks/transcriptFetchErrorCode';
import { buildAbsoluteUrl, buildPathQuery } from '@/lib/entities/paths';
import {
  META_DESCRIPTION_MAX_LENGTH,
  formatMetaDescription,
} from '@/lib/metadata';

export function buildTalkPath(
  talk: Pick<Talk, 'slug'> & {
    speaker?: Pick<Speaker, 'slug'> | null;
  }
) {
  if (!talk.speaker?.slug) {
    return `/talks/${talk.slug}`;
  }

  return `/talks/${talk.speaker.slug}/${talk.slug}`;
}

export function buildTalkStudyPath(talkId: TalkId) {
  return `/talks/edit/${talkId}/study`;
}

export type EditTalkTab = 'content' | 'study';

export function buildTalkEditPath(
  talkId: TalkId,
  tab: EditTalkTab = 'content'
) {
  if (tab === 'study') {
    return buildTalkStudyPath(talkId);
  }

  return `/talks/edit/${talkId}`;
}

export function getEditTalkTab(pathname: string): EditTalkTab {
  if (pathname.endsWith('/study')) {
    return 'study';
  }

  return 'content';
}

function formatTranscriptRetryAfter(retryAfter: number) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    timeZoneName: 'short',
    year: 'numeric',
  }).format(new Date(retryAfter));
}

export function isTranscriptFetchCoolingDown(
  fetch: {
    errorCode?: string | null;
    retryAfter?: number;
    status?: string;
  } | null,
  now = Date.now()
) {
  return (
    fetch?.status === 'failed' &&
    (fetch.errorCode === TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED ||
      fetch.errorCode === TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED) &&
    (fetch.retryAfter ?? 0) > now
  );
}

export function formatTranscriptFetchFailure(fetch: {
  message?: string;
  retryAfter?: number;
}) {
  if (!fetch.message) {
    return null;
  }

  if (!fetch.retryAfter) {
    return fetch.message;
  }

  return `${fetch.message} Try again after ${formatTranscriptRetryAfter(fetch.retryAfter)}.`;
}

export function buildTalksPath(options?: { query?: { featured?: boolean } }) {
  return `/talks${buildPathQuery(options?.query)}`;
}

const META_TITLE_MAX_LENGTH = 60;
const PAGE_TITLE_MAX_LENGTH = META_TITLE_MAX_LENGTH - ` | ${site.name}`.length;

function trimAtWordBoundary(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const lastSpace = text.lastIndexOf(' ', maxLength);

  if (lastSpace <= 0) {
    return text.slice(0, maxLength);
  }

  return text.slice(0, lastSpace);
}

export function formatTalkMetaTitle(title: string, speakerName?: string) {
  const withSpeaker = speakerName ? `${title} | ${speakerName}` : title;

  if (withSpeaker.length <= PAGE_TITLE_MAX_LENGTH) {
    return withSpeaker;
  }

  if (title.length <= PAGE_TITLE_MAX_LENGTH) {
    return title;
  }

  return trimAtWordBoundary(title, PAGE_TITLE_MAX_LENGTH);
}

export function formatTalkMetaDescription(
  summary: string | null,
  talk?: { speakerName?: string; title: string }
) {
  const text = summary?.trim();

  if (text) {
    const normalized = text.replaceAll(/\s+/gu, ' ');
    const sentence = normalized.match(/^[^.!?]+[.!?]/u)?.[0]?.trim();

    if (
      sentence &&
      sentence.length >= 70 &&
      sentence.length <= META_DESCRIPTION_MAX_LENGTH
    ) {
      return sentence;
    }

    return formatMetaDescription(normalized);
  }

  if (!talk) {
    return;
  }

  const byline = talk.speakerName ? ` by ${talk.speakerName}` : '';

  return formatMetaDescription(
    `${talk.title} is a Christ centered talk${byline}. ${site.description}`
  );
}

export function buildTalkListItemsJsonLd(
  talks: {
    speaker: { slug: string } | null;
    slug: string;
    title: string;
  }[]
) {
  return talks.map((talk, index) => {
    const url = talk.speaker
      ? buildAbsoluteUrl(buildTalkPath(talk))
      : undefined;

    return {
      '@type': 'ListItem' as const,
      ...(url && { item: url }),
      name: talk.title,
      position: index + 1,
      url,
    };
  });
}
