import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HorizontalScrollGrid } from '@/components/horizontal-scroll-grid';
import { PageHeader } from '@/components/page-header';
import { SidebarContent } from '@/components/sidebar-content';
import { TalkCard } from '@/components/talk-card';
import { TopicSelector } from '@/components/topic-selector';
import { ViewMoreCard } from '@/components/view-more-card';
import { getAllTopics, getTopicBySlug } from '@/features/topics';

type TopicPageProps = {
  params: Promise<{
    topic: string;
  }>;
};

const DISPLAY_LIMIT = 12;

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: slug } = await params;
  const [data, allTopics] = await Promise.all([getTopicBySlug(slug), getAllTopics()]);

  if (!data) {
    notFound();
  }

  const { talks, topic } = data;
  const displayedTalks = talks.slice(0, DISPLAY_LIMIT);
  const remainingCount = talks.length - DISPLAY_LIMIT;

  return (
    <HorizontalScrollGrid
      sidebar={
        <>
          <PageHeader title={topic.title} />

          <SidebarContent title="Browse Topics">
            <TopicSelector
              currentSlug={slug}
              topics={allTopics.map((t) => ({
                _id: t._id,
                slug: t.slug,
                title: t.title,
              }))}
            />
            <Link className="text-primary text-sm hover:underline" href="/topics">
              View all topics →
            </Link>
          </SidebarContent>

          <SidebarContent title="About">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Talks:</span>{' '}
                <span className="text-muted-foreground">{talks.length}</span>
              </div>
            </div>
          </SidebarContent>
        </>
      }
    >
      {displayedTalks.map((talk) => (
        <div className="min-w-[300px] shrink-0" key={talk._id}>
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
              description: talk.description,
              slug: talk.slug,
              title: talk.title,
            }}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <ViewMoreCard
          count={remainingCount}
          href={`/talks?topic=${topic._id}`}
          label="View All Talks"
        />
      )}
    </HorizontalScrollGrid>
  );
}
