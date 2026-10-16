import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { collectionJsonLd } from '@/app/collections/[collectionSlug]/_components/collection-json-ld';
import { CollectionSidebar } from '@/app/collections/[collectionSlug]/_components/collection-sidebar';
import { uniqueSpeakersFromTalks } from '@/app/collections/[collectionSlug]/_components/unique-speakers';
import { AdminEditButton } from '@/components/admin-edit-button';
import { JsonLd } from '@/components/json-ld';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { PageBreadcrumb } from '@/components/ui';
import { CollectionTalkList } from '@/features/collections/components/collection-talk-list';
import { getCollectionBySlug } from '@/features/collections/queries/get-collection-by-slug';
import { getCollectionUrl } from '@/features/collections/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/metadata';

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

  return pageMetadata({
    canonical: getCollectionUrl(collectionSlug),
    description: collection.description,
    title: collection.title,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, talks } = data;
  const uniqueSpeakers = uniqueSpeakersFromTalks(talks);
  const segments = [
    { href: '/collections', label: 'Collections' },
    { href: getCollectionUrl(collectionSlug), label: collection.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd
        data={collectionJsonLd({
          collectionSlug,
          description: collection.description,
          talks,
          title: collection.title,
        })}
      />
      <SidebarLayout
        breadcrumb={<PageBreadcrumb segments={segments} />}
        content={<CollectionTalkList talks={talks} />}
        header={
          <PageHeader
            actions={
              <AdminEditButton entity="collections" id={collection._id} />
            }
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
