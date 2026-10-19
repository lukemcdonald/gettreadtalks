import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface SpeakerRelatedTalksProps {
  speaker: Speaker;
  talks: Talk[];
}

export function SpeakerRelatedTalks({
  speaker,
  talks,
}: SpeakerRelatedTalksProps) {
  if (talks.length === 0) {
    return null;
  }

  return (
    <FeaturedGrid
      columns={{ default: 1 }}
      description={`Enjoy more talks by ${getSpeakerName(speaker)}.`}
      quickLinks={[
        {
          href: buildSpeakerPath(speaker),
          label: 'View all talks',
        },
      ]}
      sticky
      title="More Talks"
    >
      {talks.map((talk) => (
        <TalkCard key={talk._id} speaker={speaker} talk={talk} />
      ))}
    </FeaturedGrid>
  );
}
