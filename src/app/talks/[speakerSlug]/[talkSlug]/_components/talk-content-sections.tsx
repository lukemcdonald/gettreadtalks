import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { TalkMetadataBar } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-metadata-bar';
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
    <div className="space-y-12 md:space-y-16">
      {/* Metadata Bar */}
      <TalkMetadataBar talk={talk} topics={topics} />

      {/* About */}
      {talk.description && (
        <p className="max-w-prose text-muted-foreground leading-relaxed">{talk.description}</p>
      )}

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
  );
}
