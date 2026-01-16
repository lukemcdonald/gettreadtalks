import { GridList } from '@/components/grid-list';
import { ClipCard } from './clip-card';

type ClipWithSpeaker = {
  _id: string;
  description?: string;
  slug: string;
  title: string;
  speaker?: {
    firstName: string;
    imageUrl?: string;
    lastName: string;
    slug: string;
  } | null;
};

type ClipsListProps = {
  clips: ClipWithSpeaker[];
};

/**
 * Renders a grid of clip cards.
 * Returns null when empty - parent components handle empty state.
 */
export function ClipsList({ clips }: ClipsListProps) {
  if (clips.length === 0) {
    return null;
  }

  return (
    <GridList columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
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
    </GridList>
  );
}
