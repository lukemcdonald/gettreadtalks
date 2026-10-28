import type { ComponentProps } from 'react';

import { cn } from '@/utils';

export function MediaCardTitle({
  children,
  className,
  ...delegated
}: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'line-clamp-2 text-base font-semibold text-balance',
        className
      )}
      {...delegated}
    >
      {children}
    </p>
  );
}
