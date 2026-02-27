import type { Speaker } from '@/features/speakers/types';

import { SpeakerMinistryLink } from '@/app/speakers/[speakerSlug]/_components/speaker-ministry-link';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';
import { cn } from '@/utils';

interface SpeakerHeroDetailsProps {
  centered?: boolean;
  showAbout?: boolean;
  speaker: Speaker;
}

export function SpeakerHeroDetails({ centered, showAbout, speaker }: SpeakerHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);
  const hasImage = !!speaker.imageUrl;
  const hasMinistry = !!(speaker.ministry || speaker.websiteUrl);

  return (
    <header
      className={cn(
        'flex flex-col items-center gap-6 text-center',
        !centered && hasImage && 'md:flex-row md:items-start md:gap-8 md:text-left',
      )}
    >
      {hasImage && (
        <SpeakerAvatar
          className={cn('size-20', centered ? 'size-28 md:size-32' : 'md:size-28')}
          rounded="full"
          speaker={speaker}
        />
      )}

      <div className="flex-1 space-y-4">
        <div>
          {speaker.role && (
            <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
              {speaker.role}
            </p>
          )}
          <h1 className="font-semibold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
            {speakerName}
          </h1>
        </div>

        {showAbout && (
          <>
            {speaker.description && (
              <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
                {speaker.description}
              </p>
            )}
            {hasMinistry && (
              <SpeakerMinistryLink
                className="text-muted-foreground text-sm"
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
