import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkWithTopicIds } from '@/features/talks/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { formatUtcDate } from '@/convex/lib/publishedAt';
import { slugify } from '@/convex/lib/utils';
import { buildTalkPath } from '@/features/talks/utils';

export interface TalkUrlChange {
  newUrl: string;
  oldUrl: string;
}

export function getTalkFormValues(
  talk: TalkWithTopicIds,
  statusPrefill?: StatusPrefill
): TalkFormData {
  return {
    collectionId: talk.collectionId,
    collectionOrder: talk.collectionId ? talk.collectionOrder : undefined,
    featured: talk.featured ?? false,
    mediaUrl: talk.mediaUrl ?? '',
    publishedAt: talk.publishedAt ? formatUtcDate(talk.publishedAt) : '',
    scripture: talk.scripture ?? '',
    slug: talk.slug ?? '',
    speakerId: talk.speakerId,
    status: statusPrefill ?? talk.status ?? 'backlog',
    title: talk.title ?? '',
    topicIds: talk.topicIds,
  };
}

export function getUrlChangeForTalk(
  talk: Talk,
  data: TalkFormData
): TalkUrlChange | null {
  if (talk.status !== 'published') {
    return null;
  }

  const oldTalkSlug = talk.slug;
  const newTalkSlug = data.slug ? slugify(data.slug) : oldTalkSlug;
  const slugChanged = newTalkSlug !== oldTalkSlug;
  const speakerChanged = data.speakerId !== talk.speakerId;

  if (!(slugChanged || speakerChanged)) {
    return null;
  }

  const speakerSegment = speakerChanged ? '<new-speaker>' : '<speaker>';

  return {
    newUrl: buildTalkPath({
      slug: newTalkSlug,
      speaker: { slug: speakerSegment },
    }),
    oldUrl: buildTalkPath({
      slug: oldTalkSlug,
      speaker: { slug: '<speaker>' },
    }),
  };
}
