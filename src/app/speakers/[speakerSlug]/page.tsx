import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { SpeakerContentSections } from '@/app/speakers/[speakerSlug]/_components/speaker-content-sections';
import { SpeakerHero } from '@/app/speakers/[speakerSlug]/_components/speaker-hero';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { SITE_URL } from '@/constants/env';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';

interface SpeakerPageProps {
  params: Promise<{ speakerSlug: string }>;
}

export async function generateMetadata({ params }: SpeakerPageProps): Promise<Metadata> {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    return {};
  }

  const { speaker } = data;
  const name = `${speaker.firstName} ${speaker.lastName}`;

  return {
    description: speaker.description ?? `${name} — faithful minister of the Gospel.`,
    openGraph: speaker.imageUrl
      ? { images: [{ alt: name, height: 630, url: speaker.imageUrl, width: 1200 }] }
      : undefined,
    title: name,
  };
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;

  // Find featured talk, or fall back to first talk
  const featuredTalk = talks.find((t) => t.featured) ?? talks[0];

  // Check if featured talk has video content
  const hasFeaturedVideo = featuredTalk && isVideoMediaType(featuredTalk.mediaUrl);

  // Exclude featured talk from regular list only if it's a video (shown in hero)
  const remainingTalks =
    hasFeaturedVideo && talks.length > 1 && featuredTalk
      ? talks.filter((t) => t._id !== featuredTalk._id)
      : talks;

  const name = `${speaker.firstName} ${speaker.lastName}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    description: speaker.description,
    image: speaker.imageUrl,
    name,
    ...(speaker.websiteUrl && { sameAs: [speaker.websiteUrl] }),
    url: `${SITE_URL}/speakers/${speakerSlug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <EditorialProfileLayout
        content={
          <SpeakerContentSections
            clips={clips}
            collections={collections}
            hasFeaturedVideo={hasFeaturedVideo}
            speaker={speaker}
            talks={remainingTalks}
          />
        }
        hero={
          <SpeakerHero
            featuredTalk={hasFeaturedVideo ? featuredTalk : undefined}
            speaker={speaker}
          />
        }
      />
    </>
  );
}
