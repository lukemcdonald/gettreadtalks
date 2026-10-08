import type { Speaker } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';
import { getRandomTalksBySpeaker } from '@/features/talks/queries/get-random-talks-by-speaker';

interface TalkRelatedTalksProps {
  excludeTalkId: TalkId;
  speaker: Speaker;
}

export async function TalkRelatedTalks({
  excludeTalkId,
  speaker,
}: TalkRelatedTalksProps) {
  const relatedTalks = await getRandomTalksBySpeaker(
    speaker._id,
    excludeTalkId,
    5
  );

  if (relatedTalks.length === 0) {
    return null;
  }

  const speakerName = getSpeakerName(speaker);

  return (
    <FeaturedGrid
      columns={{ default: 1 }}
      description={`Enjoy more talks by ${speakerName}.`}
      quickLinks={[
        {
          href: `/speakers/${speaker.slug}`,
          label: 'View all talks',
        },
      ]}
      sticky
      title="More Talks"
    >
      {relatedTalks.map((relatedTalk) => (
        <TalkCard key={relatedTalk._id} speaker={speaker} talk={relatedTalk} />
      ))}
    </FeaturedGrid>
  );
}
