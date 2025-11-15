import type { TalkWithSpeaker } from '@/lib/features/collections/types';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TalkCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { SidebarContent, SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollectionBySlug } from '@/lib/features/collections';

type CollectionPageProps = {
  params: Promise<{
    collection: string;
  }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: slug } = await params;
  const data = await getCollectionBySlug(slug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;

  const uniqueSpeakers = Array.from(
    new Map(
      talks
        .filter(
          (talk): talk is TalkWithSpeaker & { speaker: NonNullable<TalkWithSpeaker['speaker']> } =>
            talk.speaker !== null,
        )
        .map((talk) => [talk.speaker._id, talk.speaker] as const),
    ).values(),
  );

  return (
    <SidebarLayout
      main={
        <>
          <PageHeader
            breadcrumbs={[
              { href: '/', label: 'Home' },
              { href: '/collections', label: 'Series' },
              { href: `/collections/${slug}`, label: collection.title },
            ]}
            description={collection.description}
            title={collection.title}
          />

          <div className="space-y-6">
            <GridList>
              {talks.map((talk) => (
                <TalkCard
                  featured={talk.featured}
                  key={talk._id}
                  speaker={
                    talk.speaker
                      ? {
                          firstName: talk.speaker.firstName,
                          imageUrl: talk.speaker.imageUrl,
                          lastName: talk.speaker.lastName,
                          slug: talk.speaker.slug,
                        }
                      : undefined
                  }
                  talk={{
                    _id: talk._id,
                    description: talk.description,
                    slug: talk.slug,
                    title: talk.title,
                  }}
                />
              ))}
            </GridList>
          </div>
        </>
      }
      sidebar={
        <>
          <SidebarContent title="About">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Talks:</span>{' '}
                <span className="text-muted-foreground">{talks.length}</span>
              </div>
              {uniqueSpeakers.length > 0 && (
                <div>
                  <span className="font-medium">Speakers:</span>{' '}
                  <span className="text-muted-foreground">{uniqueSpeakers.length}</span>
                </div>
              )}
            </div>
          </SidebarContent>

          {uniqueSpeakers.length > 0 && (
            <SidebarContent title="Speakers">
              <ul className="space-y-1">
                {uniqueSpeakers.map((speaker) => (
                  <li key={speaker._id}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={`/speakers/${speaker.slug}`}
                    >
                      {speaker.firstName} {speaker.lastName}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarContent>
          )}
        </>
      }
    />
  );
}
