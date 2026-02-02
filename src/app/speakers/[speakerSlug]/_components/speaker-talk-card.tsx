import type { Talk } from '@/features/talks/types';

import { MicIcon } from 'lucide-react';

import { MediaCard } from '@/components/media-card';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerTalkCardProps {
  speakerSlug: string;
  talk: Pick<Talk, 'description' | 'scripture' | 'slug' | 'title'>;
}

export function SpeakerTalkCard({ speakerSlug, talk }: SpeakerTalkCardProps) {
  return (
    <MediaCard
      ariaLabel={talk.title}
      href={getTalkUrl(speakerSlug, talk.slug)}
      media={
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <MicIcon className="size-5" />
        </div>
      }
      subtitle={talk.scripture}
      title={talk.title}
    />
  );
}
