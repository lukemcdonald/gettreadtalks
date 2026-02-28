import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { TalkHeroDetails } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-details';
import { TalkHeroMedia } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-media';
import { HeroBackground } from '@/components/hero-background';
import { getVideoThumbnail } from '@/components/media-embed';
import { Container, Section } from '@/components/ui';

interface TalkHeroProps {
  speaker: Speaker | null;
  speakerSlug: string;
  talk: Talk;
}

export function TalkHero({ speaker, speakerSlug, talk }: TalkHeroProps) {
  const imageSrc = getVideoThumbnail(talk.mediaUrl);

  return (
    <Section className="dark relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
      <HeroBackground className="blur-md grayscale" imageSrc={imageSrc} />

      <Container className="relative space-y-8">
        {/* Title & Speaker - Centered */}
        <TalkHeroDetails speaker={speaker} talk={talk} />

        {/* Video Player - Full Width */}
        {talk.mediaUrl && <TalkHeroMedia speakerSlug={speakerSlug} talk={talk} />}
      </Container>
    </Section>
  );
}
