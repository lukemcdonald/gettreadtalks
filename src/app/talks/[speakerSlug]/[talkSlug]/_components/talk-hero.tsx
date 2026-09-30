import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { TalkHeroDetails } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-details';
import { TalkHeroMedia } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero-media';
import { Container, Section } from '@/components/ui';

interface TalkHeroProps {
  speaker: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'mediaUrl' | 'slug' | 'title'>;
}

export function TalkHero({ speaker, talk }: TalkHeroProps) {
  return (
    <Section className="bg-background relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
      <Container className="relative space-y-8">
        <TalkHeroDetails speaker={speaker} talk={talk} />
        {talk.mediaUrl && <TalkHeroMedia speaker={speaker} talk={talk} />}
      </Container>
    </Section>
  );
}
