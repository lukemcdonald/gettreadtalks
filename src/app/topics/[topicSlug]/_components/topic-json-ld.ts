import { site } from '../../../../configs/site.ts';
import { talkListItemsJsonLd } from '../../../../features/talks/utils.ts';

interface TopicJsonLdInput {
  description: string;
  talks: Parameters<typeof talkListItemsJsonLd>[0];
  title: string;
  topicSlug: string;
}

export function topicJsonLd({
  description,
  talks,
  title,
  topicSlug,
}: TopicJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description,
    itemListElement: talkListItemsJsonLd(talks),
    name: title,
    url: `${site.url}/topics/${topicSlug}`,
  };
}
