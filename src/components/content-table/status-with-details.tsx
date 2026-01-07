import type { StatusType } from '@/convex/lib/validators/shared';
import type { ContentWithTimestamps } from './content-table.types';

import { CalendarIcon, ClockIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { cn } from '@/utils';

type StatusWithDetailsProps = {
  content: ContentWithTimestamps;
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

function formatDate(timestamp?: number) {
  if (!timestamp) {
    return 'N/A';
  }
  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function StatusWithDetails({ content, status }: StatusWithDetailsProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger>
          <PopoverTrigger>
            <div className={cn('size-2.5 rounded-full', getStatusColor(status))} />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{getStatusLabel(status)}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-64 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Published</div>
              <div className="text-muted-foreground">{formatDate(content.publishedAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Created</div>
              <div className="text-muted-foreground">{formatDate(content._creationTime)}</div>
            </div>
          </div>
          {!!content.updatedAt && (
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Updated</div>
                <div className="text-muted-foreground">{formatDate(content.updatedAt)}</div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
