'use client';

import type { Route } from 'next';

import { FauxLink } from '@/components/faux-link';
import { Card, CardHeader } from '@/components/ui';
import { cn } from '@/utils';

type ViewMoreCardProps = {
  className?: string;
  count?: number;
  href: string;
  label?: string;
};

export function ViewMoreCard({ className, count, href, label = 'View More' }: ViewMoreCardProps) {
  return (
    <Card className={cn('card-interactive', className)}>
      <CardHeader>
        <div className="flex h-full min-h-[120px] items-center justify-center">
          <div className="text-center">
            <FauxLink href={href}>
              <p className="font-semibold">{label}</p>
            </FauxLink>
            {count && (
              <p className="mt-1 text-muted-foreground text-sm">
                {count} {count === 1 ? 'more item' : 'more items'}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
