import type { ClipWithSpeaker } from '@/features/clips/types';

import { ContentTableRow } from '@/components/content-table-row';
import { ClipActionsMenu } from '@/features/clips/components/clip-actions-menu';
import { getClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipsTableRowProps {
  clip: ClipWithSpeaker;
}

export function ClipsTableRow({ clip }: ClipsTableRowProps) {
  const clipUrl = getClipUrl(clip.slug);

  return (
    <ContentTableRow
      actionsMenu={<ClipActionsMenu clip={clip} clipUrl={clipUrl} />}
      createdAt={clip._creationTime}
      href={clipUrl}
      publishedAt={clip.publishedAt}
      speakerName={clip.speaker ? getSpeakerName(clip.speaker) : undefined}
      status={clip.status}
      title={clip.title}
      updatedAt={clip.updatedAt}
    />
  );
}
