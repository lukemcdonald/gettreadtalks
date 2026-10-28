import type { ComponentProps } from 'react';

import { CardDescription } from '@/components/ui';
import { cn } from '@/utils';

export function MediaCardSubtitle({
  className,
  ...delegated
}: ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      className={cn('min-w-0 text-pretty', className)}
      {...delegated}
    />
  );
}
