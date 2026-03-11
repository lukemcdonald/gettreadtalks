import type { ComponentProps, ReactNode } from 'react';

import { Card, CardDescription } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { cn } from '@/utils';

export function MediaIconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      {children}
    </div>
  );
}

export function MediaCardTitle({ className, ...delegated }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn('line-clamp-2 text-balance font-semibold text-base', className)}
      {...delegated}
    />
  );
}

type MediaCardProps = {
  ariaLabel?: string;
  href: string;
  media?: ReactNode;
  prefetch?: ComponentProps<typeof FauxLink>['prefetch'];
  subtitle?: ReactNode;
  title: ReactNode;
} & ComponentProps<typeof Card>;

export function MediaCard({
  ariaLabel,
  className,
  href,
  media,
  prefetch = 'hover',
  subtitle,
  title,
  ...delegated
}: MediaCardProps) {
  return (
    <Card
      className={cn(
        'card-interactive group relative flex-row gap-4 border-0 p-4 [contain-intrinsic-size:auto_80px] [content-visibility:auto]',
        className,
      )}
      {...delegated}
    >
      {media}
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <MediaCardTitle aria-label={ariaLabel}>
          <FauxLink href={href} prefetch={prefetch}>
            {title}
          </FauxLink>
        </MediaCardTitle>
        {!!subtitle && <CardDescription>{subtitle}</CardDescription>}
      </div>
    </Card>
  );
}
