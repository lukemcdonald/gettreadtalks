import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks';

import { ClipCard } from '@/components/clip-card';
import { CollectionCard } from '@/components/collection-card';
import { GridList } from '@/components/grid-list';
import { TalkCard } from '@/components/talk-card';
import { Separator } from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';

type SpeakerContentProps = {
  clips: Clip[];
  collections: Collection[];
  speaker: Speaker;
  talks: Talk[];
};

export function SpeakerContent({ clips, collections, speaker, talks }: SpeakerContentProps) {
  return (
    <>
      {speaker.description && (
        <div className="space-y-4">
          <p className="text-muted-foreground">{speaker.description}</p>
        </div>
      )}

      <Separator />

      <div className="space-y-12">
        {talks.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-semibold text-2xl">Talks</h2>
            <p className="text-muted-foreground">Enjoy more talks by {getSpeakerName(speaker)}.</p>
            <GridList>
              {talks.map((talk) => (
                <TalkCard
                  featured={talk.featured}
                  key={talk._id}
                  speaker={{
                    firstName: speaker.firstName,
                    imageUrl: speaker.imageUrl,
                    lastName: speaker.lastName,
                    slug: speaker.slug,
                  }}
                  talk={{
                    description: talk.description,
                    slug: talk.slug,
                    title: talk.title,
                  }}
                />
              ))}
            </GridList>
          </section>
        )}

        {collections.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-semibold text-2xl">Collections</h2>
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
          </section>
        )}

        {clips.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-semibold text-2xl">Clips</h2>
            <p className="text-muted-foreground">
              Be encouraged by {clips.length === 1 ? 'this short' : 'these short'} Christ centered{' '}
              {clips.length === 1 ? 'clip' : 'clips'}.
            </p>
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
          </section>
        )}
      </div>
    </>
  );
}
