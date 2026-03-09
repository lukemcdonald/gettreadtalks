import type { ComponentProps, ReactNode } from 'react';

import { Card, CardDescription, CardTitle } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { cn } from '@/utils';

export function MediaIconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      {children}
    </div>
  );
}

type MediaCardProps = {
  ariaLabel?: string;
  href: string;
  media?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
} & ComponentProps<typeof Card>;

export function MediaCard({
  ariaLabel,
  className,
  href,
  media,
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
        <CardTitle
          render={<h3 aria-label={ariaLabel} className="line-clamp-2 text-balance text-base" />}
        >
          <FauxLink href={href}>{title}</FauxLink>
        </CardTitle>
        {!!subtitle && <CardDescription>{subtitle}</CardDescription>}
      </div>
    </Card>
  );
}
