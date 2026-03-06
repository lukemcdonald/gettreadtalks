import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils';

interface SectionHeadingProps extends ComponentProps<'h2'> {
  heading: ReactNode;
  meta?: ReactNode;
}

/**
 * Section heading with a dashed rule divider between heading and meta.
 * Heading and meta accept ReactNode — callers control links, icons, hover styles.
 */
export function SectionHeading({ className, heading, meta, ...delegated }: SectionHeadingProps) {
  return (
    <h2 className={cn('flex items-center gap-4 text-lg', className)} {...delegated}>
      <span className="shrink-0 font-bold">{heading}</span>
      <hr className="grow border-border border-t border-dashed" />
      {!!meta && (
        <span className="shrink-0 text-muted-foreground text-xs uppercase tracking-wide">
          {meta}
        </span>
      )}
    </h2>
  );
}
