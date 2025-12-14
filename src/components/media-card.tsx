'use client';

import type { ComponentProps, ReactNode } from 'react';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FauxLink } from '@/components/ui/faux-link';
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
    <Card className={cn('relative flex-row gap-4 p-4', className)} interactive {...delegated}>
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
