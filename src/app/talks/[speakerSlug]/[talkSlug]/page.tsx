import type { Metadata } from 'next';

import { Suspense } from 'react';

import { TalkPageContent } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-content';
import { TalkPageSkeleton } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-skeleton';
import { getVideoOpenGraphType } from '@/components/media-embed/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import {
  buildTalkPath,
  formatTalkMetaDescription,
  formatTalkMetaTitle,
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

  const { speaker, summary, talk } = talkResult;
  const speakerName = getSpeakerName(speaker);

  return buildPageMetadata({
    canonical: buildTalkPath({ speaker, slug: talk.slug }),
    description: formatTalkMetaDescription(summary, {
      speakerName,
      title: talk.title,
    }),
    openGraphType: getVideoOpenGraphType(talk.mediaUrl),
    title: formatTalkMetaTitle(talk.title, speakerName),
  });
}

export default function TalkPage({ params }: TalkPageProps) {
  return (
    <Suspense fallback={<TalkPageSkeleton />}>
      <TalkPageContent params={params} />
    </Suspense>
  );
}
