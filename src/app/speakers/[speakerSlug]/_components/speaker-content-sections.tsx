import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { SpeakerMetadataSidebar } from '@/app/speakers/[speakerSlug]/_components/speaker-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { ClipMediaCard } from '@/features/clips/components/clip-media-card';
import { CollectionMediaCard } from '@/features/collections/components/collection-media-card';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkMediaCard } from '@/features/talks/components/talk-media-card';

const MAX_TALKS = 6;
const MAX_COLLECTIONS = 4;
const MAX_CLIPS = 4;

function viewAllLink(count: number, max: number, label: string, href: string) {
  if (count <= max) {
    return undefined;
  }
  return [{ href, label: `View all ${count} ${label}` }];
}

interface SpeakerContentSectionsProps {
  clips: Clip[];
  collections: Collection[];
  hasFeaturedVideo?: boolean;
  speaker: Speaker;
  talks: Talk[];
}

export function SpeakerContentSections({
  clips,
  collections,
  hasFeaturedVideo,
  speaker,
  talks,
}: SpeakerContentSectionsProps) {
  const speakerName = getSpeakerName(speaker);
  const speakerTitle = speaker.role ? `${speaker.role} ${speakerName}` : speakerName;

  const talksLinks = viewAllLink(
    talks.length,
    MAX_TALKS,
    'talks',
    `/talks?speakers=${speaker.slug}`,
  );
  const collectionsLinks = viewAllLink(
    collections.length,
    MAX_COLLECTIONS,
    'collections',
    `/collections?speaker=${speaker.slug}`,
  );
  const clipsLinks = viewAllLink(
    clips.length,
    MAX_CLIPS,
    'clips',
    `/clips?speakers=${speaker.slug}`,
  );

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      {/* Main Content */}
      <div className="order-2 space-y-16 lg:order-1">
        {talks.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Enjoy more sermons by ${speakerTitle}.`}
            quickLinks={talksLinks}
            sticky
            title="Talks"
          >
            {talks.slice(0, MAX_TALKS).map((talk) => (
              <TalkMediaCard key={talk._id} speaker={speaker} talk={talk} />
            ))}
          </FeaturedGrid>
        )}

        {collections.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Curated series featuring ${speakerTitle}.`}
            quickLinks={collectionsLinks}
            sticky
            title="Collections"
          >
            {collections.slice(0, MAX_COLLECTIONS).map((collection) => (
              <CollectionMediaCard collection={collection} key={collection._id} />
            ))}
          </FeaturedGrid>
        )}

        {clips.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Short, impactful moments from ${speakerTitle}.`}
            quickLinks={clipsLinks}
            title="Clips"
          >
            {clips.slice(0, MAX_CLIPS).map((clip) => (
              <ClipMediaCard
                clip={{
                  description: clip.description,
                  slug: clip.slug,
                  title: clip.title,
                }}
                key={clip._id}
              />
            ))}
          </FeaturedGrid>
        )}
      </div>

      {/* Metadata Sidebar */}
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <SpeakerMetadataSidebar hideAbout={hasFeaturedVideo} speaker={speaker} />
      </aside>
    </div>
  );
}
