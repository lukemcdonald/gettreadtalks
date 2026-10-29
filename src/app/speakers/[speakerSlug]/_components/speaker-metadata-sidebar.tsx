import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { MetadataGroup } from '@/components/metadata-group';
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
      {!hideAbout && speaker.description && (
        <MetadataGroup className="sm:basis-full lg:basis-auto" label="About">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {speaker.description}
          </p>
        </MetadataGroup>
      )}

      {!hideAbout && (speaker.ministry || speaker.websiteUrl) && (
        <MetadataGroup label="Ministry">
          <SpeakerMinistryLink
            className="text-foreground text-sm"
            speaker={speaker}
          />
        </MetadataGroup>
      )}

      {topics.length > 0 && (
        <MetadataGroup label="Topics">
          <TopicLinks topics={topics} />
        </MetadataGroup>
      )}

      <MetadataGroup label="Actions">
        <div className="flex flex-wrap gap-2">
          <ShareSpeakerButton speaker={speaker} />
          <FavoriteSpeakerButton speaker={speaker} />
        </div>
      </MetadataGroup>
    </div>
  );
}
