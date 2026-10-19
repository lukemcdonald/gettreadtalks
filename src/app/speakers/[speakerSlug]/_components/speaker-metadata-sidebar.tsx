import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { ShareSpeakerButton } from '@/features/speakers/components/share-speaker-button';
import { SpeakerMinistryLink } from '@/features/speakers/components/speaker-ministry-link';
import { TopicLinks } from '@/features/topics/components/topic-links';
import { FavoriteSpeakerButton } from '@/features/users/components/favorite-speaker-button';

interface SpeakerMetadataSidebarProps {
  hideAbout?: boolean;
  speaker: Speaker;
  topics: Topic[];
}

export function SpeakerMetadataSidebar({
  hideAbout,
  speaker,
  topics,
}: SpeakerMetadataSidebarProps) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 lg:flex-col lg:gap-8">
      {/* About */}
      {!hideAbout && speaker.description && (
        <div className="space-y-4 sm:basis-full lg:basis-auto">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            About
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {speaker.description}
          </p>
        </div>
      )}

      {/* Ministry */}
      {!hideAbout && (speaker.ministry || speaker.websiteUrl) && (
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Ministry
          </h3>
          <SpeakerMinistryLink
            className="text-foreground text-sm"
            speaker={speaker}
          />
        </div>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Topics
          </h3>
          <TopicLinks topics={topics} />
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <ShareSpeakerButton speaker={speaker} />
          <FavoriteSpeakerButton speaker={speaker} />
        </div>
      </div>
    </div>
  );
}
