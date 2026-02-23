import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { TalkMetadataSidebar } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-metadata-sidebar';
import { FeaturedGrid } from '@/components/featured-grid';
import { Container, Section } from '@/components/ui';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface TalkContentSectionsProps {
  clips: Clip[];
  collection: Collection | null;
  relatedTalks?: Talk[];
  speaker: Speaker | null;
  speakerSlug: string;
  talk: Talk;
  talkSlug: string;
  topics: Topic[];
}

export function TalkContentSections({
  clips,
  collection,
  relatedTalks = [],
  speaker,
  speakerSlug,
  talk,
  talkSlug,
  topics,
}: TalkContentSectionsProps) {
  const speakerName = getSpeakerName(speaker ?? undefined);

  return (
    <Section className="-mt-6 md:-mt-16 lg:-mt-20" spacing="xl">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 xl:grid-cols-12">
          {/* Main Content */}
          <div className="order-2 space-y-8 xl:order-1 xl:col-span-9 xl:space-y-16">
            {/* Description */}
            {talk.description && (
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{talk.description}</p>
              </div>
            )}

            {/* Clips */}
            {clips.length > 0 && (
              <FeaturedGrid
                columns={{ default: 1 }}
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
                title="More Talks"
              >
                {relatedTalks.map((relatedTalk) => (
                  <TalkCard
                    key={relatedTalk._id}
                    speaker={speaker ?? undefined}
                    talk={relatedTalk}
                  />
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
          </div>

          {/* Metadata Sidebar */}
          <aside className="order-1 xl:sticky xl:top-20 xl:order-2 xl:col-span-3 xl:h-fit">
            <TalkMetadataSidebar
              speakerSlug={speakerSlug}
              talk={talk}
              talkSlug={talkSlug}
              topics={topics}
            />
          </aside>
        </div>
      </Container>
    </Section>
  );
}
