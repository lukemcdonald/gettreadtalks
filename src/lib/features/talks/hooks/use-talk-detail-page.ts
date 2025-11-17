'use client';

import type { SpeakerId } from '@/lib/features/speakers/types';
import type { TalkId } from '@/lib/features/talks/types';

import { useIsTalkFavorited } from '@/lib/features/users/hooks';
import { useTalkBySlug } from './use-talk-by-slug';
import { useTalksBySpeaker } from './use-talks-by-speaker';

export function useTalkDetailPage(slug: string) {
  const { data: talkData, isLoading: talkLoading } = useTalkBySlug(slug);

  const { data: isFavorited } = useIsTalkFavorited(
    talkData?.talk?._id ? talkData.talk._id : ('skip' as TalkId),
  );

  const { data: relatedTalks } = useTalksBySpeaker(
    talkData?.talk?.speakerId ? talkData.talk.speakerId : ('skip' as SpeakerId),
    3,
  );

  return {
    data: talkData,
    isFavorited,
    isLoading: talkLoading,
    notFound: talkData === null,
    relatedTalks,
  };
}
