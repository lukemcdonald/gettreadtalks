import { getSiteLanguage } from '@/configs/site';
import { buildCollectionPath } from '@/features/collections/utils';
import { buildTalkListItemsJsonLd } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface CollectionJsonLdInput {
  collectionSlug: string;
  description?: string;
  talks: Parameters<typeof buildTalkListItemsJsonLd>[0];
  title: string;
}

export function buildCollectionJsonLd({
  collectionSlug,
  description,
  talks,
  title,
}: CollectionJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description,
    inLanguage: getSiteLanguage(),
    itemListElement: buildTalkListItemsJsonLd(talks),
    name: title,
    numberOfItems: talks.length,
    url: buildAbsoluteUrl(buildCollectionPath({ slug: collectionSlug })),
  };
}
