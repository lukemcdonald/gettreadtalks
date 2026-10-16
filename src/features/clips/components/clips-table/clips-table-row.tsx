import type { AdminClip } from '@/features/clips/types';

import { ManageRow } from '@/app/manage/_components/manage-table';
import { ClipActionsMenu } from '@/features/clips/components/clip-actions-menu';
import { getClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { getEntityEditPath } from '@/lib/entities/paths';

interface ClipsTableRowProps {
  clip: AdminClip;
}

export function ClipsTableRow({ clip }: ClipsTableRowProps) {
  const editPath = getEntityEditPath('clips', clip._id);
  const publicPath =
    clip.status === 'published' ? getClipUrl(clip.slug) : undefined;

  return (
    <ManageRow
      actions={<ClipActionsMenu clip={clip} clipUrl={publicPath} />}
      editHref={editPath}
      status={clip.status}
      subtitle={clip.talkTitle || getSpeakerName(clip.speaker) || undefined}
      title={clip.title}
    />
  );
}
