import type { Speaker } from '@/features/speakers/types';
import type { Talk, TalkId } from '@/features/talks/types';

import {
  normalizeTranscriptFetchErrorCode,
  TRANSCRIPT_FETCH_ERROR_CODES,
} from '@/convex/model/talks/transcriptFetchErrorCode';
import { buildAbsoluteUrl, buildPathQuery } from '@/lib/entities/paths';

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
  const errorCode = fetch?.errorCode
    ? normalizeTranscriptFetchErrorCode(fetch.errorCode)
    : undefined;

  return (
    fetch?.status === 'failed' &&
    (errorCode === TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED ||
      errorCode === TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED) &&
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

const META_DESCRIPTION_MAX_LENGTH = 160;

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

export function formatTalkMetaDescription(summary: string | null) {
  const text = summary?.trim();

  if (!text) {
    return;
  }

  return trimAtWordBoundary(
    text.replaceAll(/\s+/gu, ' '),
    META_DESCRIPTION_MAX_LENGTH
  );
}

export function buildTalkListItemsJsonLd(
  talks: {
    speaker: { slug: string } | null;
    slug: string;
    title: string;
  }[]
) {
  return talks.map((talk, index) => ({
    '@type': 'ListItem' as const,
    name: talk.title,
    position: index + 1,
    url: talk.speaker ? buildAbsoluteUrl(buildTalkPath(talk)) : undefined,
  }));
}
