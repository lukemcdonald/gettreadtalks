import type { StatusType } from '@/convex/lib/validators/shared';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { cn } from '@/utils';
import { getStatusColor, getStatusLabel } from './content-table.utils';

type StatusIndicatorProps = {
  status: StatusType;
};

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
