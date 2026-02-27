import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { SpeakerMetadataSidebar } from '@/app/speakers/[speakerSlug]/_components/speaker-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { getSpeakerName } from '@/features/speakers/utils';
import { SpeakerClipCard } from './speaker-clip-card';
import { SpeakerCollectionCard } from './speaker-collection-card';
import { SpeakerTalkCard } from './speaker-talk-card';

const MAX_TALKS = 6;
const MAX_COLLECTIONS = 4;
const MAX_CLIPS = 4;

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
  const displayedTalks = talks.slice(0, MAX_TALKS);
  const displayedCollections = collections.slice(0, MAX_COLLECTIONS);
  const displayedClips = clips.slice(0, MAX_CLIPS);

  const hasMoreTalks = talks.length > MAX_TALKS;
  const hasMoreCollections = collections.length > MAX_COLLECTIONS;
  const hasMoreClips = clips.length > MAX_CLIPS;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      {/* Main Content */}
      <div className="order-2 space-y-16 lg:order-1">
        {talks.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Enjoy more sermons by ${speakerTitle}.`}
            // TODO: Is there a cleaner way to handle and define these quicklinks. The markup is very ugly in all cases and seems overly complex. Is ternary needed
            quickLinks={
              hasMoreTalks
                ? [
                    {
                      label: `View all ${talks.length} talks`,
                      href: `/talks?speakers=${speaker.slug}`,
                    },
                  ]
                : undefined
            }
            sticky
            title="Talks"
          >
            {displayedTalks.map((talk) => (
              <SpeakerTalkCard
                key={talk._id}
                speaker={speaker}
                // TODO: We should find and remove all speakerSlug props where speaker and speaker.slug can be used instead. Same with other entities like talkSlug and talk.slug etc.
                speakerSlug={speaker.slug}
                talk={talk}
              />
            ))}
          </FeaturedGrid>
        )}

        {collections.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Curated series featuring ${speakerTitle}.`}
            quickLinks={
              hasMoreCollections
                ? [
                    {
                      label: `View all ${collections.length} collections`,
                      href: `/collections?speakerSlug=${speaker.slug}`,
                    },
                  ]
                : undefined
            }
            sticky
            title="Collections"
          >
            {displayedCollections.map((collection) => (
              <SpeakerCollectionCard
                collection={{
                  description: collection.description,
                  slug: collection.slug,
                  title: collection.title,
                }}
                key={collection._id}
              />
            ))}
          </FeaturedGrid>
        )}

        {clips.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Short, impactful moments from ${speakerTitle}.`}
            quickLinks={
              hasMoreClips
                ? [
                    {
                      label: `View all ${clips.length} clips`,
                      href: `/clips?speakers=${speaker.slug}`,
                    },
                  ]
                : undefined
            }
            title="Clips"
          >
            {displayedClips.map((clip) => (
              <SpeakerClipCard
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
