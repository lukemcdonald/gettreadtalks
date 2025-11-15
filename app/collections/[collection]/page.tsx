import { notFound } from 'next/navigation';

import { TalkCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { DetailPageLayout, SectionContainer } from '@/components/layouts';
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

  return (
    <DetailPageLayout>
      <SectionContainer>
        <PageHeader
          breadcrumbs={[
            { href: '/', label: 'Home' },
            { href: '/collections/', label: 'Series' },
            { href: `/collections/${slug}`, label: collection.title },
          ]}
          description={collection.description}
          title={collection.title}
        />

        <div className="space-y-6">
          <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4 }}>
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
      </SectionContainer>
    </DetailPageLayout>
  );
}
