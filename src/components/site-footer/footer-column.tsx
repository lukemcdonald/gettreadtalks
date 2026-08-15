import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface FooterColumnProps {
  children: ReactNode;
  className?: string;
  title: string;
}

export function FooterColumn({
  children,
  className,
  title,
}: FooterColumnProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-foreground text-sm font-semibold uppercase">
        {title}
      </h3>
      <nav aria-label={title} className="flex flex-col space-y-2">
        {children}
      </nav>
    </div>
  );
}
