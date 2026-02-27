import type { Speaker } from '@/features/speakers/types';

import { SpeakerMinistryLink } from '@/app/speakers/[speakerSlug]/_components/speaker-ministry-link';
import { ShareSpeakerButton } from '@/features/speakers/components/share-speaker-button';
import { FavoriteSpeakerButton } from '@/features/users/components/favorite-speaker-button';

interface SpeakerMetadataSidebarProps {
  hideAbout?: boolean;
  speaker: Speaker;
}

export function SpeakerMetadataSidebar({ hideAbout, speaker }: SpeakerMetadataSidebarProps) {
  const speakerName = `${speaker.firstName} ${speaker.lastName}`;

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 xl:flex-col xl:gap-8">
      {/* About */}
      {!hideAbout && speaker.description && (
        <div className="space-y-4 sm:basis-full xl:basis-auto">
          <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            About
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{speaker.description}</p>
        </div>
      )}

      {/* Ministry */}
      {!hideAbout && (speaker.ministry || speaker.websiteUrl) && (
        <div className="space-y-4">
          <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            Ministry
          </h3>
          <SpeakerMinistryLink
            className="text-foreground text-sm"
            ministry={speaker.ministry}
            speakerSlug={speaker.slug}
            websiteUrl={speaker.websiteUrl}
          />
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <ShareSpeakerButton speakerId={speaker._id} speakerName={speakerName} />
          <FavoriteSpeakerButton speakerId={speaker._id} />
        </div>
      </div>
    </div>
  );
}
