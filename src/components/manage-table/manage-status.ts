import type { StatusType } from '@/lib/entities/types';

export type ManageStatus = 'archived' | 'draft' | 'published';

export function getManageStatus(status?: ManageStatus | StatusType) {
  if (status === 'published') {
    return {
      dotClass: 'bg-emerald-500',
      label: 'Published',
    };
  }

  if (status === 'archived') {
    return {
      dotClass: 'bg-muted-foreground/64',
      label: 'Archived',
    };
  }

  return {
    dotClass: 'bg-amber-500',
    label: 'Draft',
  };
}
