import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { SpeakerHeroBackground } from '@/app/speakers/[speaker]/_components/speaker-hero-background';
import { SpeakerHeroDetails } from '@/app/speakers/[speaker]/_components/speaker-hero-details';
import { SpeakerHeroFeaturedTalk } from '@/app/speakers/[speaker]/_components/speaker-hero-featured-talk';
import { getVideoThumbnail, isVideoMediaType } from '@/components/media-embed';
import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

interface SpeakerHeroProps {
  featuredTalk?: Talk;
  speaker: Speaker;
}

export function SpeakerHero({ featuredTalk, speaker }: SpeakerHeroProps) {
  const hasVideo = featuredTalk && isVideoMediaType(featuredTalk.mediaUrl);
  const imageSrc = getVideoThumbnail(featuredTalk?.mediaUrl);

  return (
    <Section className="dark relative overflow-hidden" spacing="3xl">
      <SpeakerHeroBackground imageSrc={imageSrc} />

      <Container
        className={cn(
          'relative',
          hasVideo
            ? 'flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12'
            : 'flex items-center justify-center',
        )}
      >
        {/* Speaker details - 50% width when video present, centered when not */}
        <div className={cn(hasVideo ? 'lg:flex-1' : 'max-w-2xl text-center')}>
          <SpeakerHeroDetails centered={!hasVideo} speaker={speaker} />
        </div>

        {hasVideo && featuredTalk?.mediaUrl && (
          <div className="lg:flex-1">
            <SpeakerHeroFeaturedTalk speaker={speaker} talk={featuredTalk} />
          </div>
        )}
      </Container>
    </Section>
  );
}
