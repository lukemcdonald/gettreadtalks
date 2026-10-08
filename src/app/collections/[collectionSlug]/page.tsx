import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { collectionJsonLd } from '@/app/collections/[collectionSlug]/_components/collection-json-ld';
import { CollectionSidebar } from '@/app/collections/[collectionSlug]/_components/collection-sidebar';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { PageBreadcrumb } from '@/components/ui';
import { CollectionTalkList } from '@/features/collections/components/collection-talk-list';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';

interface CollectionPageProps {
  params: Promise<{ collectionSlug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    return {};
  }

  const { collection } = data;

  return {
    description: collection.description,
    title: collection.title,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;
  const allSpeakers = talks
    .map((talk) => talk.speaker)
    .filter((speaker) => speaker !== null);
  const uniqueSpeakers = [
    ...new Map(allSpeakers.map((speaker) => [speaker._id, speaker])).values(),
  ];

  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          collectionSlug,
          description: collection.description,
          talks,
          title: collection.title,
        })}
      />
      <SidebarLayout
        breadcrumb={
          <PageBreadcrumb
            segments={[
              { href: '/collections', label: 'Collections' },
              { label: collection.title },
            ]}
          />
        }
        content={<CollectionTalkList talks={talks} />}
        header={
          <PageHeader
            description={collection.description}
            size="lg"
            title={collection.title}
          />
        }
        sidebar={<CollectionSidebar speakers={uniqueSpeakers} />}
      />
    </>
  );
}
