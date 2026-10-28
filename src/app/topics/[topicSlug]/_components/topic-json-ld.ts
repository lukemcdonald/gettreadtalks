import { buildTalkListItemsJsonLd } from '@/features/talks/utils';
import { buildTopicPath } from '@/features/topics/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface TopicJsonLdInput {
  description?: string;
  talks: Parameters<typeof buildTalkListItemsJsonLd>[0];
  title: string;
  topicSlug: string;
}

export function buildTopicJsonLd({
  description,
  talks,
  title,
  topicSlug,
}: TopicJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description,
    itemListElement: buildTalkListItemsJsonLd(talks),
    name: title,
    numberOfItems: talks.length,
    url: buildAbsoluteUrl(buildTopicPath({ slug: topicSlug })),
  };
}
