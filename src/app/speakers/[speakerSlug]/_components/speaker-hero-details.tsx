import type { Speaker } from '@/features/speakers/types';

import { HeroTitle } from '@/components/hero';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { SpeakerMinistryLink } from '@/features/speakers/components/speaker-ministry-link';
import { getSpeakerName } from '@/features/speakers/utils';
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
          className={cn(
            'size-20',
            isInline ? '-mt-4 md:size-24' : 'size-28 md:size-32'
          )}
          rounded="full"
          speaker={speaker}
        />
      )}

      <div className="flex-1 space-y-4">
        <div>
          {speaker.role && (
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              {speaker.role}
            </p>
          )}
          <HeroTitle className="text-foreground">{speakerName}</HeroTitle>
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
                ministry={speaker.ministry}
                speakerSlug={speaker.slug}
                websiteUrl={speaker.websiteUrl}
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
