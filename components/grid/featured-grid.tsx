import type { Route } from 'next';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { GridList } from './grid-list';

const FEATURED_PREFIX_REGEX = /^Featured\s+/;

type FeaturedGridProps = {
  allHref?: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  featuredHref?: string;
  title?: string;
};

export function FeaturedGrid({
  allHref,
  children,
  className,
  description,
  featuredHref,
  title,
}: FeaturedGridProps) {
  const itemType = title?.replace(FEATURED_PREFIX_REGEX, '') || 'Items';

  return (
    <section className={cn('space-y-6', className)}>
      {title && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">{title}</h2>
            {(allHref || featuredHref) && (
              <div className="flex items-center gap-4">
                {allHref && (
                  <Link href={allHref as Route}>
                    {featuredHref ? `All ${itemType}` : 'View All →'}
                  </Link>
                )}
                {featuredHref && <Link href={featuredHref as Route}>Featured {itemType}</Link>}
              </div>
            )}
          </div>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      )}
      <GridList columns={{ default: 1, sm: 2, md: 2, lg: 3, xl: 4 }}>{children}</GridList>
    </section>
  );
}
