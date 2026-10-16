import { site } from '@/configs/site';
import { getCollectionUrl } from '@/features/collections/utils';
import { talkListItemsJsonLd } from '@/features/talks/utils';

interface CollectionJsonLdInput {
  collectionSlug: string;
  description?: string;
  talks: Parameters<typeof talkListItemsJsonLd>[0];
  title: string;
}

export function collectionJsonLd({
  collectionSlug,
  description,
  talks,
  title,
}: CollectionJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description,
    itemListElement: talkListItemsJsonLd(talks),
    name: title,
    url: `${site.url}${getCollectionUrl(collectionSlug)}`,
  };
}
