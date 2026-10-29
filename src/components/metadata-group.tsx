import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface MetadataGroupProps {
  children: ReactNode;
  className?: string;
  label: string;
}

export function MetadataGroup({
  children,
  className,
  label,
}: MetadataGroupProps) {
  return (
    <section aria-label={label} className={cn('space-y-4', className)}>
      <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {label}
      </p>
      {children}
    </section>
  );
}
