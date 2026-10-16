import type { Metadata } from 'next';

import { Suspense } from 'react';

import { SpeakerPageContent } from '@/app/speakers/[speakerSlug]/_components/speaker-page-content';
import { SpeakerPageSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-page-skeleton';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';
import { getSpeakerName, getSpeakerUrl } from '@/features/speakers/utils';
import { pageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

interface SpeakerPageProps {
  params: Promise<{ speakerSlug: string }>;
}

export async function generateMetadata({
  params,
}: SpeakerPageProps): Promise<Metadata> {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    return {};
  }

  const { speaker } = data;
  const name = getSpeakerName(speaker);

  return pageMetadata({
    canonical: getSpeakerUrl(speakerSlug),
    description:
      speaker.description ?? `${name} — faithful minister of the Gospel.`,
    openGraphType: 'profile',
    title: name,
  });
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  return (
    <Suspense fallback={<SpeakerPageSkeleton />}>
      <SpeakerPageContent params={params} />
    </Suspense>
  );
}
