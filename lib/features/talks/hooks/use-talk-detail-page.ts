'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useIsTalkFavorited } from '@/lib/features/users/hooks';

import { useTalkBySlug } from './use-talk-by-slug';
import { useTalksBySpeaker } from './use-talks-by-speaker';

/**
 * Composite hook for talk detail pages.
 * Combines talk data, favorite status, and related talks with unified loading state.
 */
export function useTalkDetailPage(slug: string) {
  const { data: talk, isLoading: talkLoading } = useTalkBySlug(slug);

  const { data: isFavorited } = useIsTalkFavorited(talk?._id ? talk._id : ('skip' as Id<'talks'>));

  const { data: relatedTalks } = useTalksBySpeaker(
    talk?.speakerId ? talk.speakerId : ('skip' as Id<'speakers'>),
    3,
  );

  return {
    data: talk,
    isFavorited,
    isLoading: talkLoading,
    notFound: talk === null,
    relatedTalks,
  };
}
