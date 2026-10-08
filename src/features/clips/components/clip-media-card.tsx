import type { Clip } from '@/features/clips/types';

import { FilmIcon } from 'lucide-react';

import { MediaCard, MediaIconFrame } from '@/components/media-card';
import { getClipUrl } from '@/features/clips/utils';

interface ClipMediaCardProps {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
}

export function ClipMediaCard({ clip }: ClipMediaCardProps) {
  return (
    <MediaCard
      ariaLabel={clip.title}
      href={getClipUrl(clip.slug)}
      media={
        <MediaIconFrame>
          <FilmIcon className="size-5" />
        </MediaIconFrame>
      }
      subtitle={clip.description}
      title={clip.title}
    />
  );
}
