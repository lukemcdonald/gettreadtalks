import type { ClipWithSpeaker } from '@/features/clips/types';

import { ContentTableRow } from '@/components/content-table-row';
import { ClipActionsMenu } from '@/features/clips/components/clip-actions-menu';
import { getClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { getEntityEditPath, getManageTitleHref } from '@/lib/entities/paths';

interface ClipsTableRowProps {
  clip: ClipWithSpeaker;
}

export function ClipsTableRow({ clip }: ClipsTableRowProps) {
  const editPath = getEntityEditPath('clips', clip._id);
  const publicPath =
    clip.status === 'published' ? getClipUrl(clip.slug) : undefined;

  return (
    <ContentTableRow
      actionsMenu={<ClipActionsMenu clip={clip} clipUrl={publicPath} />}
      createdAt={clip._creationTime}
      entity="clips"
      href={getManageTitleHref({ editPath, publicPath })}
      id={clip._id}
      publishedAt={clip.publishedAt}
      speakerName={clip.speaker ? getSpeakerName(clip.speaker) : undefined}
      status={clip.status}
      title={clip.title}
      updatedAt={clip.updatedAt}
    />
  );
}
