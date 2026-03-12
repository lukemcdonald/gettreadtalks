import type { Talk } from '@/features/talks/types';

import { MediaEmbed } from '@/components/media-embed';

interface TalkHeroMediaProps {
  speakerSlug: string;
  talk: Talk;
}

export function TalkHeroMedia({ speakerSlug, talk }: TalkHeroMediaProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <MediaEmbed
        className="shadow-2xl"
        mediaUrl={talk.mediaUrl}
        title={talk.title}
        trackingContext={{
          entityId: talk._id,
          entitySlug: talk.slug,
          entityType: 'talk',
          speakerSlug,
        }}
      />
    </div>
  );
}
