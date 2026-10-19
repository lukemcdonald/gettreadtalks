import { site } from '@/configs/site';
import { buildTalkListItemsJsonLd } from '@/features/talks/utils';
import { buildTopicUrl } from '@/features/topics/utils';

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
    url: `${site.url}${buildTopicUrl(topicSlug)}`,
  };
}
