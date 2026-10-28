import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { buildClipJsonLd } from '@/app/clips/[clipSlug]/_components/clip-json-ld';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { getVideoOpenGraphType } from '@/components/media-embed/utils';
import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { buildClipPath, buildClipsPath } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
import { buildPageMetadata } from '@/lib/metadata';

import { ClipContent } from './_components/clip-content';
import { ClipHero } from './_components/clip-hero';

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
    openGraphType: getVideoOpenGraphType(clip.mediaUrl),
    title: clip.title,
  });
}

export default async function ClipPage({ params }: ClipPageProps) {
  const { clipSlug } = await params;
  const data = await loadClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  const { clip, speaker, talk } = data;
  const segments = [
    { href: buildClipsPath(), label: 'Clips' },
    { href: buildClipPath(clip), label: clip.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd data={buildClipJsonLd({ clip, speaker, talk })} />
      <EditorialProfileLayout
        content={<ClipContent clip={clip} speaker={speaker} talk={talk} />}
        hero={<ClipHero clip={clip} speaker={speaker} />}
      />
    </>
  );
}
