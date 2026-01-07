import type { ContentWithTimestamps } from './content-table.types';

import { CalendarIcon, ClockIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';

type DetailsPopoverProps = {
  content: ContentWithTimestamps;
};

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

export function DetailsPopover({ content }: DetailsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <ClockIcon className="size-4 text-muted-foreground hover:text-foreground" />
      </PopoverTrigger>
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
