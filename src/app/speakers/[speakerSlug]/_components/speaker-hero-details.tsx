import type { Speaker } from '@/features/speakers/types';

import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { HeroTitle } from '@/components/hero';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { SpeakerMinistryLink } from '@/features/speakers/components/speaker-ministry-link';
import { getSpeakerName, getSpeakersPath } from '@/features/speakers/utils';
import { cn } from '@/utils';

interface SpeakerHeroDetailsProps {
  speaker: Speaker;
  variant?: 'centered' | 'inline';
}

export function SpeakerHeroDetails({
  speaker,
  variant = 'centered',
}: SpeakerHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);
  const hasImage = !!speaker.imageUrl;
  const hasMinistry = !!(speaker.ministry || speaker.websiteUrl);
  const isInline = variant === 'inline';

  return (
    <header
      className={cn(
        'flex flex-col items-center gap-6 text-center',
        isInline &&
          hasImage &&
          'md:flex-row md:items-start md:gap-8 md:text-left'
      )}
    >
      {hasImage && (
        <SpeakerAvatar
          className={isInline ? '-mt-4' : undefined}
          rounded="full"
          size={isInline ? 'xl' : '2xl'}
          speaker={speaker}
        />
      )}

      <div className="flex-1 space-y-4">
        <div>
          <ArchiveBackLink href={getSpeakersPath()} label="Speakers" />
          <div
            className={cn(
              'flex flex-wrap items-center gap-3',
              isInline ? 'justify-center md:justify-start' : 'justify-center'
            )}
          >
            <HeroTitle className="text-foreground min-w-0">
              {speakerName}
            </HeroTitle>
            <AdminEditButton entity="speakers" id={speaker._id} />
          </div>
        </div>

        {isInline && (
          <>
            {speaker.description && (
              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                {speaker.description}
              </p>
            )}
            {hasMinistry && (
              <SpeakerMinistryLink
                className="text-muted-foreground"
                speaker={speaker}
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
