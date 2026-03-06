import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';
import { getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface ClipContentProps {
  clip: Clip;
  speaker: Speaker | null;
  talk: Talk | null;
}

export function ClipContent({ clip, speaker, talk }: ClipContentProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      {!!clip.description && (
        <div className="mx-auto max-w-2xl space-y-3">
          <h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            About
          </h2>
          <p className="text-muted-foreground leading-relaxed">{clip.description}</p>
        </div>
      )}

      {!!talk && !!speaker && (
        <FeaturedGrid
          columns={{ default: 1 }}
          description="This clip is taken from a full talk."
          sticky
          title="From the Talk"
        >
          <TalkCard speaker={speaker} talk={talk} />
        </FeaturedGrid>
      )}

      {!!speaker && (
        <FeaturedGrid
          columns={{ default: 1 }}
          description={`Browse all talks by ${speakerName}.`}
          quickLinks={[{ href: `/speakers/${speaker.slug}`, label: 'View all talks' }]}
          sticky
          title="Speaker"
        >
          <SpeakerCard speaker={speaker} />
        </FeaturedGrid>
      )}
    </div>
  );
}
