import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';
import type { ReactNode } from 'react';

import { TalkMetadataSidebar } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { ProseParagraphs } from '@/components/prose-paragraphs';
import { ClipCard } from '@/features/clips/components/clip-card';
import { CollectionMediaCard } from '@/features/collections/components/collection-media-card';
import { TalkStudyContent } from '@/features/talks/components/talk-study-content';
import { getStudyJumpLinks } from '@/features/talks/utils';

interface TalkContentSectionsProps {
  clips: Clip[];
  collection: Collection | null;
  relatedTalks?: ReactNode;
  speaker: Speaker | null;
  studyBody: string | null;
  summary: string | null;
  talk: Talk;
  topics: Topic[];
}

function TalkReadingSections({
  about,
  study,
}: {
  about?: string;
  study?: string;
}) {
  return (
    <div className="order-2 space-y-12 lg:order-1 lg:space-y-16">
      {about && (
        <FeaturedGrid
          columns={{ default: 1 }}
          description="What this talk covers."
          sticky
          title="About"
        >
          <ProseParagraphs text={about} />
        </FeaturedGrid>
      )}

      {study && (
        <FeaturedGrid
          columns={{ default: 1 }}
          description="Go deeper on your own or with a group."
          quickLinks={getStudyJumpLinks(study)}
          sticky
          title="Study"
        >
          <TalkStudyContent body={study} />
        </FeaturedGrid>
      )}
    </div>
  );
}

function TalkRelatedSections({
  clips,
  collection,
  speaker,
}: Pick<TalkContentSectionsProps, 'clips' | 'collection' | 'speaker'>) {
  return (
    <>
      {collection && (
        <FeaturedGrid
          columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
          description="This talk is part of a collection of related talks."
          sticky
          title="Collection"
        >
          <CollectionMediaCard collection={collection} headingLevel={3} />
        </FeaturedGrid>
      )}

      {clips.length > 0 && (
        <FeaturedGrid
          columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
          description="Short, impactful moments from this talk."
          sticky
          title="Highlights"
        >
          {clips.map((clip) => (
            <ClipCard
              clip={clip}
              headingLevel={3}
              key={clip._id}
              speaker={speaker ?? undefined}
            />
          ))}
        </FeaturedGrid>
      )}
    </>
  );
}

export function TalkContentSections({
  clips,
  collection,
  relatedTalks,
  speaker,
  studyBody,
  summary,
  talk,
  topics,
}: TalkContentSectionsProps) {
  const about = summary?.trim();
  const study = studyBody?.trim();

  return (
    <div className="space-y-12 lg:space-y-16">
      {about || study ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
          <TalkReadingSections about={about} study={study} />

          <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
            <TalkMetadataSidebar
              className="lg:flex-col lg:gap-8"
              speaker={speaker}
              talk={talk}
              topics={topics}
            />
          </aside>
        </div>
      ) : (
        <TalkMetadataSidebar speaker={speaker} talk={talk} topics={topics} />
      )}

      <TalkRelatedSections
        clips={clips}
        collection={collection}
        speaker={speaker}
      />

      {relatedTalks}
    </div>
  );
}
