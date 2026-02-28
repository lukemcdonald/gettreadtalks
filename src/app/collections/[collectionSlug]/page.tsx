import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { CollectionContent } from '@/app/collections/[collectionSlug]/_components/collection-content';
import { CollectionSidebar } from '@/app/collections/[collectionSlug]/_components/collection-sidebar';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { site } from '@/configs/site';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';

interface CollectionPageProps {
  params: Promise<{ collectionSlug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
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
  const allSpeakers = talks.map((talk) => talk.speaker).filter((speaker) => speaker !== null);
  const uniqueSpeakers = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker._id, speaker])).values(),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description: collection.description,
    itemListElement: talks.map((talk, index) => ({
      '@type': 'ListItem',
      name: talk.title,
      position: index + 1,
      url: talk.speaker ? `${site.url}/talks/${talk.speaker.slug}/${talk.slug}` : undefined,
    })),
    name: collection.title,
    url: `${site.url}/collections/${collectionSlug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SidebarLayout
        content={<CollectionContent talks={talks} />}
        header={
          <PageHeader description={collection.description} title={collection.title} variant="lg" />
        }
        sidebar={<CollectionSidebar speakers={uniqueSpeakers} />}
      />
    </>
  );
}
