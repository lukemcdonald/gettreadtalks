import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils';

interface SectionHeadingProps extends ComponentProps<'h2'> {
  heading: ReactNode;
  meta?: ReactNode;
}

/**
 * Section heading with a solid rule between heading and meta.
 * Heading and meta accept ReactNode — callers control links, icons, hover styles.
 */
export function SectionHeading({
  className,
  heading,
  meta,
  ...delegated
}: SectionHeadingProps) {
  return (
    <h2
      className={cn('flex items-center gap-4 text-lg', className)}
      {...delegated}
    >
      <span className="shrink-0 font-bold">{heading}</span>
      <hr className="bg-input h-px grow border-none" />
      {!!meta && (
        <span className="text-muted-foreground shrink-0 text-xs tracking-wide uppercase">
          {meta}
        </span>
      )}
    </h2>
  );
}
