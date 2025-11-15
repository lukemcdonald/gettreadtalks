'use client';

import type { Route } from 'next';

import Link from 'next/link';

import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ViewMoreCardProps = {
  className?: string;
  count?: number;
  href: string;
  label?: string;
};

export function ViewMoreCard({ className, count, href, label = 'View More' }: ViewMoreCardProps) {
  return (
    <Card
      className={cn('group min-w-[300px] flex-shrink-0 transition-all hover:shadow-md', className)}
      render={<Link href={href as Route} />}
    >
      <CardHeader>
        <div className="flex h-full min-h-[120px] items-center justify-center">
          <div className="text-center">
            <p className="font-semibold group-hover:text-primary">{label}</p>
            {count !== undefined && (
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
