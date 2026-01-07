import type { StatusType } from '@/convex/lib/validators/shared';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { cn } from '@/utils';

type StatusIndicatorProps = {
  status: StatusType;
};

function getStatusColor(status: StatusType) {
  switch (status) {
    case 'published':
      return 'bg-green-500';
    case 'approved':
      return 'bg-blue-500';
    case 'backlog':
      return 'bg-yellow-500';
    case 'archived':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusLabel(status: StatusType) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn('size-2.5 rounded-full', getStatusColor(status))} />
      </TooltipTrigger>
      <TooltipContent>{getStatusLabel(status)}</TooltipContent>
    </Tooltip>
  );
}
