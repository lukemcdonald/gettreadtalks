import { notFound } from 'next/navigation';

import { TalkCard } from '@/components/cards';
import { HorizontalScrollGrid } from '@/components/grid';
import { SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getTopicBySlug } from '@/lib/features/topics';

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: slug } = await params;
  const data = await getTopicBySlug(slug);

  if (!data) {
    notFound();
  }

  const { talks, topic } = data;

  return (
    <HorizontalScrollGrid
      sidebar={
        <>
          <PageHeader
            breadcrumbs={[
              { href: '/', label: 'Home' },
              { href: '/topics/', label: 'Topics' },
              { href: `/topics/${slug}`, label: topic.title },
            ]}
            title={topic.title}
          />

          <SidebarContent title="About">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Talks:</span>{' '}
                <span className="text-muted-foreground">{talks.length}</span>
              </div>
            </div>
          </SidebarContent>
        </>
      }
    >
      {talks.map((talk) => (
        <div className="min-w-[300px] flex-shrink-0" key={talk._id}>
          <TalkCard
            featured={talk.featured}
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
        </div>
      ))}
    </HorizontalScrollGrid>
  );
}
