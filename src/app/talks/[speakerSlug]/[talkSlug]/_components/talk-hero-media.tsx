import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { MediaEmbed } from '@/components/media-embed';

interface TalkHeroMediaProps {
  speaker: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'mediaUrl' | 'slug' | 'title'>;
}

export function TalkHeroMedia({ speaker, talk }: TalkHeroMediaProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <MediaEmbed
        className="shadow-2xl"
        mediaUrl={talk.mediaUrl}
        title={talk.title}
        trackingContext={{
          entityId: talk._id,
          entitySlug: talk.slug,
          entityTitle: talk.title,
          entityType: 'talk',
          speakerId: speaker?._id,
          speakerSlug: speaker?.slug,
        }}
      />
    </div>
  );
}
