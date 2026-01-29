import { GridList } from '@/components/grid-list';
import { ClipCard } from './clip-card';

// TODO: infer or get from convex schemas
interface ClipWithSpeaker {
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
}

interface ClipsListProps {
  clips: ClipWithSpeaker[];
}

export function ClipsList({ clips }: ClipsListProps) {
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
