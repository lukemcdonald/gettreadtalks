import type { ClipWithSpeaker } from '../types';

import { rotateContent } from '@/utils';
import { ClipCard } from './clip-card';
import { ClipFeaturedCard } from './clip-featured-card';

interface ClipsListProps {
  clips: ClipWithSpeaker[];
}

export function ClipsList({ clips }: ClipsListProps) {
  if (clips.length === 0) {
    return null;
  }

  const [featuredClip] = rotateContent(clips, { period: 'daily', count: 1 });

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:row-span-4 lg:mb-2 xl:row-span-5">
        <ClipFeaturedCard clip={featuredClip} />
      </div>

      {clips.map((clip) => (
        <ClipCard
          clip={{
            description: clip.description,
            slug: clip.slug,
            title: clip.title,
          }}
          key={clip._id}
          speaker={
            clip.speaker
              ? {
                  firstName: clip.speaker.firstName,
                  imageUrl: clip.speaker.imageUrl,
                  lastName: clip.speaker.lastName,
                  slug: clip.speaker.slug,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
