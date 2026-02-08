import type { ClipWithSpeaker } from '../types';

import { MediaEmbed } from '@/components/media-embed';
import { ClipCard } from './clip-card';

interface ClipsListProps {
  clips: ClipWithSpeaker[];
}

export function ClipsList({ clips }: ClipsListProps) {
  if (clips.length === 0) {
    return null;
  }

  const [featuredClip] = clips;

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Featured Video - Spans 2 columns and multiple rows */}
      <div className="overflow-hidden rounded-2xl md:col-span-2 lg:row-span-4 xl:row-span-5">
        <MediaEmbed mediaUrl={featuredClip.mediaUrl} title={featuredClip.title} />
      </div>

      {/* All Clips as cards - Flow naturally around the video */}
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
