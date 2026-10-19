import { pluralize } from '@/utils/pluralize';

export function formatTopicTalkCountPhrase(totalTalks: number) {
  const count = totalTalks === 1 ? 'this' : `these ${totalTalks}`;

  return `${count} Christ centered ${pluralize(totalTalks, 'talk', 'talks')}`;
}

export function formatTopicPageDescription(
  description: string | undefined,
  totalTalks: number
) {
  if (description) {
    return description;
  }

  return `Elevate your spiritual heartbeat with ${formatTopicTalkCountPhrase(totalTalks)}.`;
}

export function formatTopicMetaDescription(
  description: string | undefined,
  title: string,
  totalTalks: number
) {
  if (description) {
    return description;
  }

  return `Elevate your spiritual heartbeat with ${formatTopicTalkCountPhrase(totalTalks)} on ${title}.`;
}
