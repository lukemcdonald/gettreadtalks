import { site } from '../../../../configs/site.ts';
import { talkListItemsJsonLd } from '../../../../features/talks/utils.ts';

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
    url: `${site.url}/collections/${collectionSlug}`,
  };
}
