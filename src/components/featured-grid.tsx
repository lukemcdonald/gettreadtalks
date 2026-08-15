import type { GridColumns } from './grid-list';
import type { ReactNode } from 'react';

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
  description?: ReactNode;
  quickLinks?: NavItem[];
  sticky?: boolean;
  title?: string;
}

export function FeaturedGrid({
  children,
  className,
  columns,
  description,
  quickLinks,
  sticky,
  title,
}: FeaturedGridProps) {
  const defaultColumns: GridColumns = {
    default: 1,
    lg: 3,
    md: 2,
    sm: 2,
    xl: 3,
  };
  const gridColumns = columns || defaultColumns;
  const stickyClass = sticky ? 'lg:sticky lg:top-20 lg:h-fit' : undefined;

  return (
    <div
      className={cn('grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-8', className)}
    >
      <aside className={cn(stickyClass)}>
        <div className="space-y-6">
          <header className="text-muted-foreground space-y-3">
            <h2 className="text-xs font-semibold tracking-wide uppercase">
              {title}
            </h2>
            {!!description && (
              <p className="text-sm leading-relaxed sm:text-base">
                {description}
              </p>
            )}
          </header>

          {!!quickLinks && quickLinks.length > 0 && (
            <div className="space-y-3">
              <nav className="flex flex-col gap-2">
                {quickLinks.map((item) => (
                  <Link
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
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
