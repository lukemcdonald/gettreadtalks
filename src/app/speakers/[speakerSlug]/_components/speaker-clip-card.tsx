import type { Clip } from '@/features/clips/types';

import { FilmIcon } from 'lucide-react';

import { MediaCard } from '@/components/media-card';

interface SpeakerClipCardProps {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
}

export function SpeakerClipCard({ clip }: SpeakerClipCardProps) {
  return (
    <MediaCard
      ariaLabel={clip.title}
      href={`/clips/${clip.slug}`}
      media={
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FilmIcon className="size-5" />
        </div>
      }
      subtitle={clip.description}
      title={clip.title}
    />
  );
}
