import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface SidebarContentProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function SidebarContent({ children, className, title }: SidebarContentProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {!!title && (
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
