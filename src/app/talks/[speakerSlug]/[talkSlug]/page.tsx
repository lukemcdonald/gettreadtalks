import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TalkPageContent } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-content';
import { TalkPageSkeleton } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-skeleton';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

interface TalkPageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

// fallow-ignore-next-line complexity
export async function generateMetadata({
  params,
}: TalkPageProps): Promise<Metadata> {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    return {};
  }

  const { speaker, talk } = talkResult;
  const speakerName = getSpeakerName(speaker);

  return {
    description:
      talk.description ??
      (speakerName ? `A talk by ${speakerName}.` : undefined),
    title: talk.title,
  };
}

export default function TalkPage({ params }: TalkPageProps) {
  return (
    <Suspense fallback={<TalkPageSkeleton />}>
      <TalkPageContent params={params} />
    </Suspense>
  );
}
