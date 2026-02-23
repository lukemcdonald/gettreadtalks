import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { TalkHeroBackground } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-background';
import { TalkHeroDetails } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-details';
import { TalkHeroMedia } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-media';
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
    <Section className="dark relative overflow-hidden" spacing="3xl">
      <TalkHeroBackground imageSrc={imageSrc} />

      <Container className="relative space-y-8">
        {/* Title & Speaker - Centered */}
        <TalkHeroDetails speaker={speaker} talk={talk} />

        {/* Video Player - Full Width */}
        {talk.mediaUrl && <TalkHeroMedia speakerSlug={speakerSlug} talk={talk} />}
      </Container>
    </Section>
  );
}
