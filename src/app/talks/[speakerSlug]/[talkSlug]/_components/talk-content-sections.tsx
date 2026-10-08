import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';
import type { ReactNode } from 'react';

import { TalkMetadataSidebar } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { ClipCard } from '@/features/clips/components/clip-card';
import { CollectionMediaCard } from '@/features/collections/components/collection-media-card';

interface TalkContentSectionsProps {
  clips: Clip[];
  collection: Collection | null;
  relatedTalks?: ReactNode;
  speaker: Speaker | null;
  talk: Talk;
  topics: Topic[];
}

export function TalkContentSections({
  clips,
  collection,
  relatedTalks,
  speaker,
  talk,
  topics,
}: TalkContentSectionsProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 space-y-8 lg:order-1 lg:space-y-16">
        {collection && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description="This talk is part of a collection of related talks."
            sticky
            title="Collection"
          >
            <CollectionMediaCard collection={collection} />
          </FeaturedGrid>
        )}

        {clips.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description="Short, impactful moments from this talk."
            sticky
            title="Highlights"
          >
            {clips.map((clip) => (
              <ClipCard
                clip={clip}
                key={clip._id}
                speaker={speaker ?? undefined}
              />
            ))}
          </FeaturedGrid>
        )}

        {relatedTalks}
      </div>

      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <TalkMetadataSidebar speaker={speaker} talk={talk} topics={topics} />
      </aside>
    </div>
  );
}
