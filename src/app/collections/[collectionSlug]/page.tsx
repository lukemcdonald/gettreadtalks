import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { buildCollectionJsonLd } from '@/app/collections/[collectionSlug]/_components/collection-json-ld';
import { CollectionSidebar } from '@/app/collections/[collectionSlug]/_components/collection-sidebar';
import { getUniqueSpeakersFromTalks } from '@/app/collections/[collectionSlug]/_components/unique-speakers';
import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { CollectionTalkList } from '@/features/collections/components/collection-talk-list';
import { loadCollectionBySlug } from '@/features/collections/queries/load-collection-by-slug';
import {
  buildCollectionPath,
  buildCollectionsPath,
} from '@/features/collections/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
import { buildPageMetadata } from '@/lib/metadata';

interface CollectionPageProps {
  params: Promise<{ collectionSlug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collectionSlug } = await params;
  const data = await loadCollectionBySlug(collectionSlug);

  if (!data) {
    return {};
  }

  const { collection } = data;

  return buildPageMetadata({
    canonical: buildCollectionPath(collection),
    description: collection.description,
    hasGeneratedShareImage: true,
    title: collection.title,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params;
  const data = await loadCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;
  const uniqueSpeakers = getUniqueSpeakersFromTalks(talks);
  const segments = [
    { href: buildCollectionsPath(), label: 'Collections' },
    { href: buildCollectionPath(collection), label: collection.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd
        data={buildCollectionJsonLd({
          collectionSlug,
          description: collection.description,
          talks,
          title: collection.title,
        })}
      />
      <SidebarLayout
        content={<CollectionTalkList talks={talks} />}
        header={
          <>
            <ArchiveBackLink
              href={buildCollectionsPath()}
              label="Collections"
            />
            <PageHeader
              actions={
                <AdminEditButton entity="collections" id={collection._id} />
              }
              description={collection.description}
              size="lg"
              title={collection.title}
            />
          </>
        }
        render={<article />}
        sidebar={<CollectionSidebar speakers={uniqueSpeakers} />}
      />
    </>
  );
}
