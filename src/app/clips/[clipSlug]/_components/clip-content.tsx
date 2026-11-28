import type { MetadataSidebarLayout } from '@/components/metadata-sidebar';
import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { AdminActionsGroup } from '@/components/admin-actions-group';
import { AdminEditButton } from '@/components/admin-edit-button';
import { FeaturedGrid } from '@/components/featured-grid';
import { MetadataGroup } from '@/components/metadata-group';
import {
  MetadataSidebar,
  MetadataSidebarActions,
} from '@/components/metadata-sidebar';
import { ProseParagraphs } from '@/components/prose-paragraphs';
import { ScriptureGroup } from '@/components/scripture-group';
import { ShareClipButton } from '@/features/clips/components/share-clip-button';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';

interface ClipContentProps {
  clip: Clip;
  speaker: Speaker | null;
  talk: Talk | null;
}

function ClipMetadataSidebar({
  layout,
  clip,
  talk,
}: Omit<ClipContentProps, 'speaker'> & { layout: MetadataSidebarLayout }) {
  return (
    <MetadataSidebar layout={layout}>
      <MetadataGroup label="Actions">
        <MetadataSidebarActions layout={layout}>
          <ShareClipButton clip={clip} />
        </MetadataSidebarActions>
      </MetadataGroup>

      <ScriptureGroup scripture={talk?.scripture} />

      <AdminActionsGroup layout={layout}>
        <AdminEditButton entity="clips" id={clip._id} />
      </AdminActionsGroup>
    </MetadataSidebar>
  );
}

function ClipRelatedSections({
  speaker,
  talk,
}: Pick<ClipContentProps, 'speaker' | 'talk'>) {
  return (
    <>
      {talk && (
        <FeaturedGrid
          columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
          description="This clip is taken from a full talk."
          sticky
          title="From the Talk"
        >
          <TalkCard headingLevel={3} speaker={speaker} talk={talk} />
        </FeaturedGrid>
      )}

      {speaker && (
        <FeaturedGrid
          columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
          description={`Browse all talks by ${getSpeakerName(speaker)}.`}
          quickLinks={[
            { href: buildSpeakerPath(speaker), label: 'View all talks' },
          ]}
          sticky
          title="Speaker"
        >
          <SpeakerCard headingLevel={3} speaker={speaker} />
        </FeaturedGrid>
      )}
    </>
  );
}

export function ClipContent({ clip, speaker, talk }: ClipContentProps) {
  const about = clip.description?.trim();

  return (
    <div className="space-y-12 lg:space-y-16">
      {about ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-[1fr_280px]">
          <div className="order-2 lg:order-1">
            <FeaturedGrid
              columns={{ default: 1 }}
              description="What this clip covers."
              sticky
              title="About"
            >
              <ProseParagraphs text={about} />
            </FeaturedGrid>
          </div>

          <aside className="order-1 lg:sticky lg:top-20 lg:order-2 lg:h-fit">
            <ClipMetadataSidebar clip={clip} layout="column" talk={talk} />
          </aside>
        </div>
      ) : (
        <ClipMetadataSidebar clip={clip} layout="row" talk={talk} />
      )}

      <ClipRelatedSections speaker={speaker} talk={talk} />
    </div>
  );
}
