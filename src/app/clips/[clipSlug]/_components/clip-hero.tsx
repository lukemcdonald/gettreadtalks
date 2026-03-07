import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { HeroTitle } from '@/components/hero';
import { MediaEmbed } from '@/components/media-embed';
import { Container, Section } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipHeroProps {
  clip: Clip;
  speaker: Speaker | null;
}

export function ClipHero({ clip, speaker }: ClipHeroProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <Section className="dark relative overflow-hidden bg-gray-950 py-6 sm:py-8 md:py-12 lg:py-16">
      <Container className="relative space-y-8">
        <div className="space-y-2 text-center">
          <HeroTitle className="text-foreground" size="sm">
            {clip.title}
          </HeroTitle>
          {speaker && (
            <p className="text-lg text-muted-foreground">
              by{' '}
              <Link className="hover:underline" href={`/speakers/${speaker.slug}`}>
                {speakerName}
              </Link>
            </p>
          )}
        </div>

        {!!clip.mediaUrl && (
          <div className="mx-auto w-full max-w-4xl">
            <MediaEmbed
              mediaUrl={clip.mediaUrl}
              title={clip.title}
              trackingContext={{
                entityId: clip._id,
                entitySlug: clip.slug,
                entityType: 'clip',
              }}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
