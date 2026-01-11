import type { StatusType } from '@/convex/lib/validators/shared';
import type { ContentWithTimestamps } from './content-table.types';

import {
  CalendarIcon as CreatedAtIcon,
  Calendar1 as PublishedAtIcon,
  Circle as StatusIcon,
  CalendarClockIcon as UpdatedAtIcon,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { formatDate, getStatusColor, getStatusLabel } from './content-table.utils';
import { ContentTableItemDetail } from './content-table-item-detail';

type ContentTableItemDetailsProps = {
  createdAt: ContentWithTimestamps['_creationTime'];
  publishedAt?: ContentWithTimestamps['publishedAt'];
  updatedAt?: ContentWithTimestamps['updatedAt'];
  status?: StatusType;
};

export function ContentTableItemDetails({
  createdAt,
  updatedAt,
  publishedAt,
  status,
}: ContentTableItemDetailsProps) {
  const statusColor = getStatusColor(status);

  return (
    <Popover>
      <PopoverTrigger className="text-center" openOnHover>
        <StatusIcon className={`size-4 ${statusColor}`} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-sm">
        <div className="space-y-3">
          {!!status && (
            <ContentTableItemDetail
              description={getStatusLabel(status)}
              icon={StatusIcon}
              iconClass={statusColor}
              title="Status"
            />
          )}
          <ContentTableItemDetail
            description={formatDate(createdAt) ?? 'N/A'}
            icon={CreatedAtIcon}
            title="Created"
          />
          {!!publishedAt && (
            <ContentTableItemDetail
              description={formatDate(publishedAt) ?? 'N/A'}
              icon={PublishedAtIcon}
              title="Published"
            />
          )}
          {!!updatedAt && (
            <ContentTableItemDetail
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
