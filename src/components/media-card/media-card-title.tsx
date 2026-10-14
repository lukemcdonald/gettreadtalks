import type { ComponentProps } from 'react';

import { cn } from '@/utils';

export function MediaCardTitle({
  children,
  className,
  ...delegated
}: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'line-clamp-2 text-base font-semibold text-balance',
        className
      )}
      {...delegated}
    >
      {children}
    </h3>
  );
}
