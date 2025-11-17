import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClipCard, CollectionCard, TalkCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { SidebarContent, SidebarLayout } from '@/components/layouts';
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
    <SidebarLayout
      main={
        <>
          <PageHeader
            breadcrumbs={[
              { href: '/', label: 'Home' },
              { href: '/speakers', label: 'Speakers' },
              { href: `/speakers/${slug}`, label: speakerName },
            ]}
            title={speakerName}
          />

          {speaker.description && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{speaker.description}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-12">
            {talks.length > 0 && (
              <section className="space-y-6">
                <h2 className="font-bold text-2xl">Talks</h2>
                <p className="text-muted-foreground">Enjoy more talks by {speakerName}.</p>
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
                <h2 className="font-bold text-2xl">Collections</h2>
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
                <h2 className="font-bold text-2xl">Clips</h2>
                <p className="text-muted-foreground">
                  Be encouraged by {clips.length === 1 ? 'this short' : 'these short'} Christ
                  centered {clips.length === 1 ? 'clip' : 'clips'}.
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
        </>
      }
      sidebar={
        <>
          {speaker.imageUrl && (
            <SidebarContent>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image alt={speakerName} className="object-cover" fill src={speaker.imageUrl} />
              </div>
            </SidebarContent>
          )}

          <SidebarContent title="About">
            <div className="space-y-2 text-sm">
              {speaker.role && (
                <div>
                  <span className="font-medium">Role:</span>{' '}
                  <span className="text-muted-foreground">{speaker.role}</span>
                </div>
              )}
              {speaker.ministry && (
                <div>
                  <span className="font-medium">Ministry:</span>{' '}
                  <span className="text-muted-foreground">{speaker.ministry}</span>
                </div>
              )}
            </div>
          </SidebarContent>

          <SidebarContent title="Content">
            <div className="space-y-2 text-sm">
              <div>
                <Link className="text-primary hover:underline" href={`/speakers/${slug}#talks`}>
                  {talks.length} {talks.length === 1 ? 'Talk' : 'Talks'} →
                </Link>
              </div>
              {collections.length > 0 && (
                <div>
                  <Link
                    className="text-primary hover:underline"
                    href={`/speakers/${slug}#collections`}
                  >
                    {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'} →
                  </Link>
                </div>
              )}
              {clips.length > 0 && (
                <div>
                  <Link className="text-primary hover:underline" href={`/speakers/${slug}#clips`}>
                    {clips.length} {clips.length === 1 ? 'Clip' : 'Clips'} →
                  </Link>
                </div>
              )}
            </div>
          </SidebarContent>
        </>
      }
    />
  );
}
