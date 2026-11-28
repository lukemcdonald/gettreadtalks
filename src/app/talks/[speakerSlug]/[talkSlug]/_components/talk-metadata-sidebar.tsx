import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { AdminActionsGroup } from '@/components/admin-actions-group';
import { AdminEditButton } from '@/components/admin-edit-button';
import { MetadataGroup } from '@/components/metadata-group';
import { ScriptureGroup } from '@/components/scripture-group';
import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { TalkActions } from '@/features/talks/components/talk-actions';
import { formatTalkFormat } from '@/features/talks/utils';
import { TopicLinks } from '@/features/topics/components/topic-links';
import { cn } from '@/utils';

function TalkFormatGroup({ format }: { format: Talk['format'] }) {
  if (!format) {
    return null;
  }

  return (
    <MetadataGroup label="Format">
      <p className="text-sm">{formatTalkFormat(format)}</p>
    </MetadataGroup>
  );
}

interface TalkMetadataSidebarProps {
  className?: string;
  speaker: Speaker | null;
  talk: Talk;
  topics: Topic[];
}

export function TalkMetadataSidebar({
  className,
  speaker,
  talk,
  topics,
}: TalkMetadataSidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12',
        className
      )}
    >
      <MetadataGroup label="Actions">
        <TalkActions speaker={speaker} talk={talk} />
      </MetadataGroup>

      <ScriptureGroup scripture={talk.scripture} />

      {topics.length > 0 && (
        <MetadataGroup label="Topics">
          <TopicLinks topics={topics} />
        </MetadataGroup>
      )}

      <TalkFormatGroup format={talk.format} />

      <AdminActionsGroup>
        <AdminEditButton entity="talks" id={talk._id} />
        <FeatureTalkButton speaker={speaker} talk={talk} />
      </AdminActionsGroup>
    </div>
  );
}
