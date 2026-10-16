import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { HeroTitle } from '@/components/hero';
import { MediaEmbed } from '@/components/media-embed';
import { Container, Section } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { getClipsPath } from '@/features/clips/utils';
import { getSpeakerName, getSpeakerUrl } from '@/features/speakers/utils';

interface ClipHeroProps {
  clip: Clip;
  speaker: Speaker | null;
}

export function ClipHero({ clip, speaker }: ClipHeroProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <Section className="bg-background relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16">
      <Container className="relative space-y-8">
        <div className="space-y-2 text-center">
          <div>
            <ArchiveBackLink href={getClipsPath()} label="Clips" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <HeroTitle className="text-foreground min-w-0" size="sm">
                {clip.title}
              </HeroTitle>
              <AdminEditButton entity="clips" id={clip._id} />
            </div>
          </div>
          {speaker && (
            <p className="text-muted-foreground text-lg">
              by{' '}
              <Link
                className="hover:underline"
                href={getSpeakerUrl(speaker.slug)}
              >
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
