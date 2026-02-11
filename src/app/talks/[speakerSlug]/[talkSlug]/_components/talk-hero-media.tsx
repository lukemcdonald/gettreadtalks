import type { Talk } from '@/features/talks/types';

import { MediaEmbed } from '@/components/media-embed';

interface TalkHeroMediaProps {
  talk: Talk;
}

export function TalkHeroMedia({ talk }: TalkHeroMediaProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        <MediaEmbed mediaUrl={talk.mediaUrl} title={talk.title} />
      </div>
    </div>
  );
}
