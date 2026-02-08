import { notFound } from 'next/navigation';

import { CollectionContent } from '@/app/collections/[collectionSlug]/_components/collection-content';
import { CollectionSidebar } from '@/app/collections/[collectionSlug]/_components/collection-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';

interface CollectionPageProps {
  params: Promise<{ collectionSlug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;
  const allSpeakers = talks.map((talk) => talk.speaker).filter((speaker) => speaker !== null);
  const uniqueSpeakers = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker._id, speaker])).values(),
  );

  return (
    <SidebarLayout
      content={<CollectionContent talks={talks} />}
      header={
        <PageHeader description={collection.description} title={collection.title} variant="lg" />
      }
      sidebar={<CollectionSidebar speakers={uniqueSpeakers} />}
    />
  );
}
