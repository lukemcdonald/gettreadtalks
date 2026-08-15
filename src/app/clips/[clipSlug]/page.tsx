import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { site } from '@/configs/site';
import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { getSpeakerName } from '@/features/speakers/utils';

import { ClipContent } from './_components/clip-content';
import { ClipHero } from './_components/clip-hero';

interface ClipPageProps {
  params: Promise<{ clipSlug: string }>;
}

export async function generateMetadata({
  params,
}: ClipPageProps): Promise<Metadata> {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    return {};
  }

  const { clip, speaker } = data;
  const speakerName = speaker ? getSpeakerName(speaker) : '';

  return {
    description:
      clip.description ??
      (speakerName ? `A clip from ${speakerName}.` : undefined),
    title: clip.title,
  };
}

export default async function ClipPage({ params }: ClipPageProps) {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  const { clip, speaker, talk } = data;

  const speakerName = speaker ? getSpeakerName(speaker) : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isVideoMediaType(clip.mediaUrl) ? 'VideoObject' : 'AudioObject',
    description: clip.description,
    embedUrl: clip.mediaUrl,
    name: clip.title,
    url: `${site.url}/clips/${clip.slug}`,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(clip.publishedAt && {
      uploadDate: new Date(clip.publishedAt).toISOString(),
    }),
    ...(talk &&
      speaker && {
        isPartOf: {
          '@type': 'CreativeWork',
          name: talk.title,
          url: `${site.url}/talks/${speaker.slug}/${talk.slug}`,
        },
      }),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <EditorialProfileLayout
        content={<ClipContent clip={clip} speaker={speaker} talk={talk} />}
        hero={<ClipHero clip={clip} speaker={speaker} />}
      />
    </>
  );
}
