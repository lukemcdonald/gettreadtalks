import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface TalkContentSectionsProps {
  clips: Clip[];
  collection: Collection | null;
  relatedTalks?: Talk[];
  speaker: Speaker | null;
  talk: Talk;
}

export function TalkContentSections({
  clips,
  collection,
  relatedTalks = [],
  speaker,
  talk,
}: TalkContentSectionsProps) {
  const speakerName = getSpeakerName(speaker ?? undefined);

  return (
    <>
      {/* Description */}
      {talk.description && (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{talk.description}</p>
        </div>
      )}

      {/* Clips */}
      {clips.length > 0 && (
        <FeaturedGrid
          columns={{ default: 1, sm: 2, md: 2, lg: 2 }}
          description="Short, impactful moments from this talk."
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
          columns={{ default: 1, sm: 2, md: 2, lg: 2 }}
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
          title="More Talks"
        >
          {relatedTalks.map((relatedTalk) => (
            <TalkCard key={relatedTalk._id} speaker={speaker ?? undefined} talk={relatedTalk} />
          ))}
        </FeaturedGrid>
      )}

      {/* Collection Info */}
      {collection && (
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl tracking-tight">Part of a Series</h2>
          <p className="text-muted-foreground">{collection.description}</p>
        </div>
      )}
    </>
  );
}
