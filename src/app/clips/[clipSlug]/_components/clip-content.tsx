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

function ClipAbout({ description }: { description: string }) {
  return (
    <MetadataGroup label="About">
      <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
        {description
          .split(/\n+/u)
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
    </MetadataGroup>
  );
}

function ClipRelatedCards({
  speaker,
  talk,
}: {
  speaker: Speaker | null;
  talk: Talk | null;
}) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="space-y-8 lg:space-y-16">
      {talk && (
        <FeaturedGrid
          columns={{ default: 1 }}
          description="This clip is taken from a full talk."
          sticky
          title="From the Talk"
        >
          <TalkCard headingLevel={3} speaker={speaker} talk={talk} />
        </FeaturedGrid>
      )}

      {speaker && (
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
  );
}

export function ClipContent({ clip, speaker, talk }: ClipContentProps) {
  const about = clip.description?.trim();
  const related = <ClipRelatedCards speaker={speaker} talk={talk} />;

  if (!about) {
    return related;
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
      <div className="order-2 lg:order-1">{related}</div>
      <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
        <ClipAbout description={about} />
      </aside>
    </div>
  );
}
