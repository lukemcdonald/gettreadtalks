import type { Metadata } from 'next';

import { Suspense } from 'react';

import { ClipPageContent } from '@/app/clips/[clipSlug]/_components/clip-page-content';
import { ClipPageSkeleton } from '@/app/clips/[clipSlug]/_components/clip-page-skeleton';
import { getVideoOpenGraphType } from '@/components/media-embed/utils';
import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { buildClipPath } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildPageMetadata } from '@/lib/metadata';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

interface ClipPageProps {
  params: Promise<{ clipSlug: string }>;
}

function getClipMetaDescription(
  description: string | undefined,
  speakerName: string
) {
  if (description) {
    return description;
  }

  if (!speakerName) {
    return;
  }

  return `A clip from ${speakerName}.`;
}

export async function generateMetadata({
  params,
}: ClipPageProps): Promise<Metadata> {
  const { clipSlug } = await params;
  const data = await loadClipBySlug(clipSlug);

  if (!data) {
    return {};
  }

  const { clip, speaker } = data;

  return buildPageMetadata({
    canonical: buildClipPath(clip),
    description: getClipMetaDescription(
      clip.description,
      getSpeakerName(speaker)
    ),
    hasGeneratedShareImage: true,
    openGraphType: getVideoOpenGraphType(clip.mediaUrl),
    title: clip.title,
  });
}

export default function ClipPage({ params }: ClipPageProps) {
  return (
    <Suspense fallback={<ClipPageSkeleton />}>
      <ClipPageContent params={params} />
    </Suspense>
  );
}
