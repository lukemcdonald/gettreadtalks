import type { ManageStatus } from './manage-status';
import type { StatusType } from '@/lib/entities/types';

import { Badge } from '@/components/ui';
import { cn } from '@/utils';

import { getManageStatus } from './manage-status';

export function ManageStatusBadge({
  status,
}: {
  status?: ManageStatus | StatusType;
}) {
  const { dotClass, label } = getManageStatus(status);

  return (
    <Badge variant="outline">
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', dotClass)}
      />
      {label}
    </Badge>
  );
}

export function ManageStatusDot({
  className,
  status,
}: {
  className?: string;
  status?: ManageStatus | StatusType;
}) {
  const { dotClass, label } = getManageStatus(status);

  return (
    <span
      aria-label={label}
      className={cn(
        'inline-block size-1.5 shrink-0 rounded-full',
        dotClass,
        className
      )}
    />
  );
}
