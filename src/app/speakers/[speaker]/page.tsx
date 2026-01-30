import { notFound } from 'next/navigation';

import { SpeakerContentSections } from '@/app/speakers/[speaker]/_components/speaker-content-sections';
import { SpeakerHero } from '@/app/speakers/[speaker]/_components/speaker-hero';
import { EditorialProfileLayout } from '@/components/layouts';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';

interface SpeakerPageProps {
  params: Promise<{ speaker: string }>;
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { speaker: slug } = await params;
  const data = await getSpeakerBySlug(slug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;

  // Find featured talk, or fall back to first talk
  const featuredTalk = talks.find((t) => t.featured) ?? talks[0];

  // Exclude featured talk from regular list if we have more than one
  const remainingTalks =
    talks.length > 1 && featuredTalk ? talks.filter((t) => t._id !== featuredTalk._id) : talks;

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
      hero={<SpeakerHero featuredTalk={featuredTalk} speaker={speaker} />}
    />
  );
}
