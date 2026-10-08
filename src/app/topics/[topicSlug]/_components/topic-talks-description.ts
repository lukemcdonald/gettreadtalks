import { pluralize } from '../../../../utils/pluralize.ts';

export function topicTalkCountPhrase(totalTalks: number) {
  const count = totalTalks === 1 ? 'this' : `these ${totalTalks}`;

  return `${count} Christ centered ${pluralize(totalTalks, 'talk', 'talks')}`;
}
