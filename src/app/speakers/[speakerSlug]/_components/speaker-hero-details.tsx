import type { Speaker } from '@/features/speakers/types';

import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { HeroTitle } from '@/components/hero';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { SpeakerMinistryLink } from '@/features/speakers/components/speaker-ministry-link';
import { buildSpeakersPath, getSpeakerName } from '@/features/speakers/utils';
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
        'flex w-full flex-col items-center gap-6',
        isInline && hasImage && 'md:flex-row md:items-start md:gap-8'
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

      <div
        className={cn(
          'flex w-full min-w-0 flex-1 flex-col items-center gap-4 text-center',
          isInline && 'md:items-start md:text-left'
        )}
      >
        <div className="max-w-full space-y-2">
          <div>
            <ArchiveBackLink href={buildSpeakersPath()} label="Speakers" />
            <div className="flex flex-wrap items-center gap-3">
              <HeroTitle className="text-foreground min-w-0">
                {speakerName}
              </HeroTitle>
              <AdminEditButton entity="speakers" id={speaker._id} />
            </div>
          </div>
          {speaker.role && (
            <p className="text-muted-foreground text-sm">{speaker.role}</p>
          )}
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
