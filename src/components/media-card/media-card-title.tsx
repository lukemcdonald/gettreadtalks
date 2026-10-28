import type { ComponentProps, ReactNode } from 'react';

import { createContext, use } from 'react';

import { cn } from '@/utils';

const mediaCardHeadingLevelContext = createContext<2 | 3>(2);

type MediaCardTitleProps = ComponentProps<'h2'> & {
  level?: 2 | 3;
};

export function MediaCardHeadingLevel({
  children,
  level,
}: {
  children: ReactNode;
  level: 2 | 3;
}) {
  return (
    <mediaCardHeadingLevelContext.Provider value={level}>
      {children}
    </mediaCardHeadingLevelContext.Provider>
  );
}

export function MediaCardTitle({
  children,
  className,
  level,
  ...delegated
}: MediaCardTitleProps) {
  const contextLevel = use(mediaCardHeadingLevelContext);
  const headingLevel = level ?? contextLevel;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

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
