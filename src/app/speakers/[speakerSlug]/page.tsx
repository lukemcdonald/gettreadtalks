import { notFound } from 'next/navigation';

import { SpeakerContentSections } from '@/app/speakers/[speakerSlug]/_components/speaker-content-sections';
import { SpeakerHero } from '@/app/speakers/[speakerSlug]/_components/speaker-hero';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';

interface SpeakerPageProps {
  params: Promise<{ speakerSlug: string }>;
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

  return (
    <EditorialProfileLayout
      content={
        <SpeakerContentSections
          clips={clips}
          collections={collections}
          speaker={speaker}
          talks={remainingTalks}
        />
      }
      hero={
        <SpeakerHero featuredTalk={hasFeaturedVideo ? featuredTalk : undefined} speaker={speaker} />
      }
    />
  );
}
