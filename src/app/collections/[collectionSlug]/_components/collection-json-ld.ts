import { site } from '@/configs/site';
import { buildCollectionUrl } from '@/features/collections/utils';
import { buildTalkListItemsJsonLd } from '@/features/talks/utils';

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
    itemListElement: buildTalkListItemsJsonLd(talks),
    name: title,
    url: `${site.url}${buildCollectionUrl(collectionSlug)}`,
  };
}
