import type { Talk } from '@/features/talks/types';

import { notFound } from 'next/navigation';

import { SpeakerContentSections } from '@/app/speakers/[speakerSlug]/_components/speaker-content-sections';
import { SpeakerHero } from '@/app/speakers/[speakerSlug]/_components/speaker-hero';
import { speakerJsonLd } from '@/app/speakers/[speakerSlug]/_components/speaker-json-ld';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';
import { getSpeakerName } from '@/features/speakers/utils';
import { rotateCachedContent } from '@/utils';

interface SpeakerPageContentProps {
  params: Promise<{ speakerSlug: string }>;
}

async function featuredTalkForHero(talks: Talk[]) {
  const featuredCandidates = talks.filter(
    (talk) => talk.featured && isVideoMediaType(talk.mediaUrl)
  );
  const [featuredTalk] = await rotateCachedContent(
    featuredCandidates.length > 0 ? featuredCandidates : talks,
    {
      count: 1,
      period: 'daily',
    }
  );

  return featuredTalk;
}

// fallow-ignore-next-line complexity
export async function SpeakerPageContent({ params }: SpeakerPageContentProps) {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;
  const featuredTalk = await featuredTalkForHero(talks);
  const hasFeaturedVideo =
    featuredTalk && isVideoMediaType(featuredTalk.mediaUrl);
  const remainingTalks =
    hasFeaturedVideo && talks.length > 1 && featuredTalk
      ? talks.filter((talk) => talk._id !== featuredTalk._id)
      : talks;
  const name = getSpeakerName(speaker);

  return (
    <>
      <JsonLd
        data={speakerJsonLd({
          description: speaker.description,
          imageUrl: speaker.imageUrl,
          name,
          speakerSlug,
          websiteUrl: speaker.websiteUrl,
        })}
      />
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
