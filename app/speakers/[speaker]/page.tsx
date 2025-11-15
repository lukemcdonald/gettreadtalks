import { notFound } from 'next/navigation';

import { ClipCard, CollectionCard, TalkCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { DetailPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
import { getSpeakerBySlug } from '@/lib/features/speakers';

type SpeakerPageProps = {
  params: Promise<{
    speaker: string;
  }>;
};

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { speaker: slug } = await params;
  const data = await getSpeakerBySlug(slug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;
  const speakerName = `${speaker.firstName} ${speaker.lastName}`;

  return (
    <DetailPageLayout>
      <SectionContainer>
        <PageHeader
          breadcrumbs={[
            { href: '/', label: 'Home' },
            { href: '/speakers/', label: 'Speakers' },
            { href: `/speakers/${slug}`, label: speakerName },
          ]}
          title={speakerName}
        />

        {speaker.description && (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">{speaker.description}</p>
            {speaker.role && <p className="text-muted-foreground">Role: {speaker.role}</p>}
            {speaker.ministry && (
              <p className="text-muted-foreground">Ministry: {speaker.ministry}</p>
            )}
          </div>
        )}

        <Separator />

        <div className="space-y-12">
          {talks.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-bold text-2xl">Talks</h2>
              <p className="text-muted-foreground">Enjoy more talks by {speakerName}.</p>
              <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4 }}>
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
                      _id: talk._id,
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
              <h2 className="font-bold text-2xl">Collections</h2>
              <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4 }}>
                {collections.map((collection) => (
                  <CollectionCard
                    collection={{
                      _id: collection._id,
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
              <h2 className="font-bold text-2xl">Clips</h2>
              <p className="text-muted-foreground">
                Be encouraged by this short Christ centered clip.
              </p>
              {clips.length > 1 ? (
                <p className="text-muted-foreground">
                  Be encouraged by these short Christ centered clips.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Be encouraged by this short Christ centered clip.
                </p>
              )}
              <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4 }}>
                {clips.map((clip) => (
                  <ClipCard
                    clip={{
                      _id: clip._id,
                      description: clip.description,
                      slug: clip.slug,
                      title: clip.title,
                    }}
                    key={clip._id}
                    speaker={{
                      firstName: speaker.firstName,
                      imageUrl: speaker.imageUrl,
                      lastName: speaker.lastName,
                      slug: speaker.slug,
                    }}
                  />
                ))}
              </GridList>
            </section>
          )}
        </div>
      </SectionContainer>
    </DetailPageLayout>
  );
}
