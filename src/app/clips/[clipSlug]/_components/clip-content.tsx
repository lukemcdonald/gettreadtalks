import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { MetadataGroup } from '@/components/metadata-group';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface ClipContentProps {
  clip: Clip;
  speaker: Speaker | null;
  talk: Talk | null;
}

export function ClipContent({ clip, speaker, talk }: ClipContentProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      {/* Main Content */}
      <div className="order-2 space-y-16 lg:order-1">
        {!!talk && !!speaker && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description="This clip is taken from a full talk."
            sticky
            title="From the Talk"
          >
            <TalkCard headingLevel={3} speaker={speaker} talk={talk} />
          </FeaturedGrid>
        )}

        {!!speaker && (
          <FeaturedGrid
            columns={{ default: 1 }}
            description={`Browse all talks by ${speakerName}.`}
            quickLinks={[
              { href: buildSpeakerPath(speaker), label: 'View all talks' },
            ]}
            sticky
            title="Speaker"
          >
            <SpeakerCard headingLevel={3} speaker={speaker} />
          </FeaturedGrid>
        )}
      </div>

      {/* Sidebar */}
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        {!!clip.description && (
          <MetadataGroup label="About">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {clip.description}
            </p>
          </MetadataGroup>
        )}
      </aside>
    </div>
  );
}
