import type { Metadata } from 'next';

import { Suspense } from 'react';

import { SpeakerPageContent } from '@/app/speakers/[speakerSlug]/_components/speaker-page-content';
import { SpeakerPageSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-page-skeleton';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';

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
  const name = `${speaker.firstName} ${speaker.lastName}`;

  return {
    description:
      speaker.description ?? `${name} — faithful minister of the Gospel.`,
    openGraph: speaker.imageUrl
      ? {
          images: [
            { alt: name, height: 630, url: speaker.imageUrl, width: 1200 },
          ],
        }
      : undefined,
    title: name,
  };
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  return (
    <Suspense fallback={<SpeakerPageSkeleton />}>
      <SpeakerPageContent params={params} />
    </Suspense>
  );
}
