import type { ReactNode } from 'react';
import type { GridColumns } from './grid-list';

import Link from 'next/link';

import { cn } from '@/utils';
import { GridList } from './grid-list';

interface NavItem {
  href: string;
  label: string;
}

interface FeaturedGridProps {
  children: ReactNode;
  className?: string;
  columns?: GridColumns;
  description?: string;
  quickLinks?: NavItem[];
  quickLinksTitle?: string;
  sticky?: boolean;
  title?: string;
}

export function FeaturedGrid({
  children,
  className,
  columns,
  description,
  quickLinks,
  quickLinksTitle,
  sticky,
  title,
}: FeaturedGridProps) {
  const defaultColumns: GridColumns = { default: 1, sm: 2, md: 2, lg: 3, xl: 3 };
  const gridColumns = columns || defaultColumns;
  const stickyClass = sticky ? 'lg:sticky lg:top-16 lg:h-fit' : undefined;
  const linksTitle = quickLinksTitle ?? title;

  return (
    <div className={cn('grid gap-12 lg:grid-cols-[280px_1fr]', className)}>
      <aside className={cn(stickyClass)}>
        <div className="space-y-6">
          <header className="mt-4 space-y-3">
            <h2 className="font-semibold text-2xl leading-tight tracking-tight">{title}</h2>
            {!!description && (
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {description}
              </p>
            )}
          </header>

          {!!quickLinks && quickLinks.length > 0 && (
            <div className="space-y-3">
              {!!linksTitle && (
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {linksTitle}
                </h3>
              )}

              <nav className="flex flex-col gap-2">
                {quickLinks.map((item) => (
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        <GridList columns={gridColumns}>{children}</GridList>
      </div>
    </div>
  );
}
