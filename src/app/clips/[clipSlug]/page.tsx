import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { clipJsonLd } from '@/app/clips/[clipSlug]/_components/clip-json-ld';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { buildClipUrl, buildClipsPath } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/metadata';

import { ClipContent } from './_components/clip-content';
import { ClipHero } from './_components/clip-hero';

interface ClipPageProps {
  params: Promise<{ clipSlug: string }>;
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
  const speakerName = getSpeakerName(speaker);

  return pageMetadata({
    canonical: buildClipUrl(clipSlug),
    description:
      clip.description ??
      (speakerName ? `A clip from ${speakerName}.` : undefined),
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
    { href: buildClipUrl(clip.slug), label: clip.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd data={clipJsonLd({ clip, speaker, talk })} />
      <EditorialProfileLayout
        content={<ClipContent clip={clip} speaker={speaker} talk={talk} />}
        hero={<ClipHero clip={clip} speaker={speaker} />}
      />
    </>
  );
}
