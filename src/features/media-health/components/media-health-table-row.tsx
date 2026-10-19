import type { OpenMediaCheck } from '../types';

import { getHoverItems, ManageRow } from '@/components/manage-table';
import { IgnoreMediaCheckButton } from '@/features/media-health/components/ignore-media-check-button';
import { toYouTubeWatchUrl } from '@/utils/youtube';

interface MediaHealthTableRowProps {
  item: OpenMediaCheck;
}

export function MediaHealthTableRow({ item }: MediaHealthTableRowProps) {
  const statusLabel = item.status === 'private' ? 'Private' : 'Missing';

  return (
    <ManageRow
      actions={<IgnoreMediaCheckButton mediaCheckId={item._id} />}
      editHref={item.adminPath}
      hoverItems={getHoverItems([
        { label: 'Status', value: statusLabel },
        { label: 'Video', value: toYouTubeWatchUrl(item.mediaUrl) },
      ])}
      subtitle={`${statusLabel} · First seen ${formatFirstSeen(item.firstBrokenAt)}`}
      title={item.title}
    />
  );
}

function formatFirstSeen(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
