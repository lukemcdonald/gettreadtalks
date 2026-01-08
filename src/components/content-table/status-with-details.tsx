import type { StatusType } from '@/convex/lib/validators/shared';
import type { ContentWithTimestamps } from './content-table.types';

import { CalendarIcon, ClockIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { cn } from '@/utils';
import { formatDate, getStatusColor, getStatusLabel } from './content-table.utils';

type StatusWithDetailsProps = {
  content: ContentWithTimestamps;
  status: StatusType;
};

export function StatusWithDetails({ content, status }: StatusWithDetailsProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className={cn('size-2.5 rounded-full', getStatusColor(status))} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn('size-2.5 rounded-full', getStatusColor(status))} />
            <div>
              <div className="font-medium">Status</div>
              <div className="text-muted-foreground">{getStatusLabel(status)}</div>
            </div>
          </div>
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
