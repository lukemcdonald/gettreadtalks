import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { GridList } from '@/components/grid-list';
import { ClipCard } from '@/features/clips/components/clip-card';
import { CollectionCard } from '@/features/collections/components/collection-card';
import { getSpeakerName } from '@/features/speakers/utils';
import { SpeakerSection } from './speaker-section';
import { SpeakerTalkCard } from './speaker-talk-card';

interface SpeakerContentSectionsProps {
  clips: Clip[];
  collections: Collection[];
  speaker: Speaker;
  talks: Talk[];
}

export function SpeakerContentSections({
  clips,
  collections,
  speaker,
  talks,
}: SpeakerContentSectionsProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <>
      {talks.length > 0 && (
        <SpeakerSection
          description={`More teachings by ${speakerName}`}
          id="talks"
          title="All Talks"
        >
          <GridList>
            {talks.map((talk) => (
              <SpeakerTalkCard key={talk._id} speakerSlug={speaker.slug} talk={talk} />
            ))}
          </GridList>
        </SpeakerSection>
      )}

      {collections.length > 0 && (
        <SpeakerSection
          description="Curated series and themed collections"
          id="collections"
          title="Collections"
        >
          <GridList>
            {collections.map((collection) => (
              <CollectionCard
                collection={{
                  description: collection.description,
                  slug: collection.slug,
                  title: collection.title,
                }}
                key={collection._id}
              />
            ))}
          </GridList>
        </SpeakerSection>
      )}

      {clips.length > 0 && (
        <SpeakerSection description="Short, impactful moments" id="clips" title="Clips">
          <GridList>
            {clips.map((clip) => (
              <ClipCard
                clip={{
                  description: clip.description,
                  slug: clip.slug,
                  title: clip.title,
                }}
                key={clip._id}
              />
            ))}
          </GridList>
        </SpeakerSection>
      )}
    </>
  );
}
