import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils';

interface ContentTableItemDetailProps {
  description: string;
  icon: LucideIcon;
  iconClass?: string;
  title: string;
}

export function StatusPopoverDetail({
  description,
  icon: Icon,
  iconClass,
  title,
}: ContentTableItemDetailProps) {
  return (
    <div className="flex items-start gap-2.5">
      {!!Icon && <Icon className={cn('mt-0.5 size-4 text-muted-foreground', iconClass)} />}
      <dl className="flex flex-col gap-0.5">
        <dt className="font-medium">{title}</dt>
        <dd className="text-muted-foreground">{description}</dd>
      </dl>
    </div>
  );
}
