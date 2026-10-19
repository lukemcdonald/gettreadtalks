import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TalkPageContent } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-content';
import { TalkPageSkeleton } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-skeleton';
import { getSpeakerName } from '@/features/speakers/utils';
import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import {
  buildTalkPath,
  formatTalkMetaDescription,
} from '@/features/talks/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

interface TalkPageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TalkPageProps): Promise<Metadata> {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await loadTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    return {};
  }

  const { speaker, talk, topics } = talkResult;

  return buildPageMetadata({
    canonical: buildTalkPath({ speaker, slug: talk.slug }),
    description: formatTalkMetaDescription({
      description: talk.description,
      scripture: talk.scripture,
      speakerName: getSpeakerName(speaker),
      topicTitles: topics.map((topic) => topic.title),
    }),
    openGraphType: 'video.other',
    title: talk.title,
  });
}

export default function TalkPage({ params }: TalkPageProps) {
  return (
    <Suspense fallback={<TalkPageSkeleton />}>
      <TalkPageContent params={params} />
    </Suspense>
  );
}
