import type { StatusType } from '@/lib/entities/types';

import {
  CalendarIcon as CreatedAtIcon,
  Calendar1 as PublishedAtIcon,
  Circle as StatusIcon,
  CalendarClockIcon as UpdatedAtIcon,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { formatDate, getStatusColor, getStatusLabel } from '@/utils';
import { StatusPopoverDetail } from '../status-popover/status-popover-detail';

interface StatusPopoverProps {
  createdAt: number;
  publishedAt?: number;
  status?: StatusType;
  updatedAt?: number;
}

export function StatusPopover({ createdAt, publishedAt, status, updatedAt }: StatusPopoverProps) {
  const statusColor = getStatusColor(status);

  return (
    <Popover>
      <PopoverTrigger className="text-center" openOnHover>
        <StatusIcon className={`size-4 ${statusColor}`} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-sm">
        <div className="space-y-3">
          {!!status && (
            <StatusPopoverDetail
              description={getStatusLabel(status)}
              icon={StatusIcon}
              iconClass={statusColor}
              title="Status"
            />
          )}
          <StatusPopoverDetail
            description={formatDate(createdAt) ?? 'N/A'}
            icon={CreatedAtIcon}
            title="Created"
          />
          {!!publishedAt && (
            <StatusPopoverDetail
              description={formatDate(publishedAt) ?? 'N/A'}
              icon={PublishedAtIcon}
              title="Published"
            />
          )}
          {!!updatedAt && (
            <StatusPopoverDetail
              description={formatDate(updatedAt) ?? 'N/A'}
              icon={UpdatedAtIcon}
              title="Updated"
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
