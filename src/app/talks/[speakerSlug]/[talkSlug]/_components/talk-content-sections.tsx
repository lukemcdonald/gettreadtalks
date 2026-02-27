import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { TalkMetadataSidebar } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface TalkContentSectionsProps {
  clips: Clip[];
  collection: Collection | null;
  relatedTalks?: Talk[];
  speaker: Speaker | null;
  talk: Talk;
  topics: Topic[];
}

export function TalkContentSections({
  clips,
  collection,
  relatedTalks = [],
  speaker,
  talk,
  topics,
}: TalkContentSectionsProps) {
  const speakerName = getSpeakerName(speaker ?? undefined);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
      {/* Main Content */}
      <div className="order-2 space-y-8 lg:order-1 lg:col-span-9 lg:space-y-16">
        {/* Clips */}
        {clips.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description="Short, impactful moments from this talk."
            sticky
            title="Highlights"
          >
            {clips.map((clip) => (
              <TalkCard
                key={clip._id}
                speaker={speaker ?? undefined}
                talk={{
                  description: clip.description,
                  slug: clip.slug,
                  title: clip.title,
                }}
              />
            ))}
          </FeaturedGrid>
        )}

        {/* Related Talks from Speaker */}
        {relatedTalks.length > 0 && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Enjoy more talks by ${speakerName}.`}
            quickLinks={
              speaker
                ? [
                    {
                      href: `/speakers/${speaker.slug}`,
                      label: 'View all talks →',
                    },
                  ]
                : undefined
            }
            sticky
            title="More Talks"
          >
            {relatedTalks.map((relatedTalk) => (
              <TalkCard
                key={relatedTalk._id}
                showAvatar={false}
                speaker={speaker ?? undefined}
                talk={relatedTalk}
              />
            ))}
          </FeaturedGrid>
        )}

        {/* Collection Info */}
        {collection && (
          <div className="space-y-4">
            <h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              Part of a Series
            </h2>
            <p className="text-muted-foreground">{collection.description}</p>
          </div>
        )}
      </div>

      {/* Metadata Sidebar */}
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:col-span-3 lg:h-fit">
        <TalkMetadataSidebar talk={talk} topics={topics} />
      </aside>
    </div>
  );
}
