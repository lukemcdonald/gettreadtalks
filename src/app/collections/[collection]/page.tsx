import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GridList } from '@/components/grid-list';
import { PageHeader } from '@/components/page-header';
import { PageLayout } from '@/components/page-layout';
import { SidebarContent } from '@/components/sidebar-content';
import { TalkCard } from '@/components/talk-card';
import { getCollectionBySlug } from '@/features/collections';

type CollectionPageProps = {
  params: Promise<{ collection: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: slug } = await params;
  const data = await getCollectionBySlug(slug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;
  const allSpeakers = talks.map((talk) => talk.speaker).filter((speaker) => speaker !== null);
  const uniqueSpeakers = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker._id, speaker])).values(),
  );

  return (
    <PageLayout>
      <PageLayout.Sidebar>
        <PageHeader description={collection.description} title={collection.title} />

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
      </PageLayout.Sidebar>
      <PageLayout.Content>
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
                description: talk.description,
                slug: talk.slug,
                title: talk.title,
              }}
            />
          ))}
        </GridList>
      </PageLayout.Content>
    </PageLayout>
  );
}
