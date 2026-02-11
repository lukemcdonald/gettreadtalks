import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { TalkHeroBackground } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-background';
import { TalkHeroDetails } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-details';
import { TalkHeroMedia } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-media';
import { TalkHeroMetadata } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-metadata';
import { getVideoThumbnail } from '@/components/media-embed';
import { Container, Section } from '@/components/ui';

interface TalkHeroProps {
  speaker: Speaker | null;
  speakerSlug: string;
  talk: Talk;
  talkSlug: string;
  topics: Topic[];
}

export function TalkHero({ speaker, speakerSlug, talk, talkSlug, topics }: TalkHeroProps) {
  const imageSrc = getVideoThumbnail(talk.mediaUrl);

  return (
    <Section className="dark relative overflow-hidden" spacing="3xl">
      <TalkHeroBackground imageSrc={imageSrc} />

      <Container className="relative space-y-8">
        {/* Title & Speaker - Centered */}
        <TalkHeroDetails speaker={speaker} talk={talk} />

        {/* Video Player - Full Width */}
        {talk.mediaUrl && <TalkHeroMedia talk={talk} />}

        {/* Actions, Topics, Scripture - Below Video */}
        <TalkHeroMetadata
          speakerSlug={speakerSlug}
          talk={talk}
          talkSlug={talkSlug}
          topics={topics}
        />
      </Container>
    </Section>
  );
}
