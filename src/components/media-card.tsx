'use client';

import type { ComponentProps, ReactNode } from 'react';

import { FauxLink } from '@/components/faux-link';
import { Card, CardDescription, CardTitle } from '@/components/ui';
import { cn } from '@/utils';

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
      className={cn('card-interactive group relative flex-row gap-4 p-4', className)}
      {...delegated}
    >
      {media}
      <div className="flex-1 space-y-0.5">
        <CardTitle className="line-clamp-2">
          <FauxLink aria-label={ariaLabel} href={href}>
            {title}
          </FauxLink>
        </CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </div>
    </Card>
  );
}
