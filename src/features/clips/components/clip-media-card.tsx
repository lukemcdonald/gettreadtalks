import type { Clip } from '@/features/clips/types';

import { FilmIcon } from 'lucide-react';

import { MediaCard, MediaIconFrame } from '@/components/media-card';
import { buildClipPath } from '@/features/clips/utils';

interface ClipMediaCardProps {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
  headingLevel?: 2 | 3;
}

export function ClipMediaCard({ clip, headingLevel }: ClipMediaCardProps) {
  return (
    <MediaCard
      ariaLabel={clip.title}
      headingLevel={headingLevel}
      href={buildClipPath(clip)}
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
