import type { ComponentProps } from 'react';

import { cn } from '@/utils';

type MediaCardTitleProps = ComponentProps<'h2'> & {
  level?: 2 | 3;
};

export function MediaCardTitle({
  children,
  className,
  level = 2,
  ...delegated
}: MediaCardTitleProps) {
  const Heading = level === 3 ? 'h3' : 'h2';

  return (
    <Heading
      className={cn(
        'line-clamp-2 text-base font-semibold text-balance',
        className
      )}
      {...delegated}
    >
      {children}
    </Heading>
  );
}
