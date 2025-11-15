import { SectionHeader } from '@/components/layouts';
import { cn } from '@/lib/utils';
import { GridList } from './grid-list';

const FEATURED_PREFIX_REGEX = /^Featured\s+/;

type GridColumns = {
  default?: 1 | 2 | 3 | 4 | 5;
  lg?: 1 | 2 | 3 | 4 | 5;
  md?: 1 | 2 | 3 | 4 | 5;
  sm?: 1 | 2 | 3 | 4 | 5;
  xl?: 1 | 2 | 3 | 4 | 5;
};

type FeaturedGridProps = {
  allHref?: string;
  children: React.ReactNode;
  className?: string;
  columns?: GridColumns;
  description?: string;
  featuredHref?: string;
  sidebar?: React.ReactNode;
  title?: string;
};

export function FeaturedGrid({
  allHref,
  children,
  className,
  columns,
  description,
  featuredHref,
  sidebar,
  title,
}: FeaturedGridProps) {
  const itemType = title?.replace(FEATURED_PREFIX_REGEX, '') || 'Items';

  const actions: Array<{ href: string; label: string }> = [];
  if (allHref) {
    actions.push({
      href: allHref,
      label: featuredHref ? `All ${itemType}` : 'View All →',
    });
  }
  if (featuredHref) {
    actions.push({
      href: featuredHref,
      label: `Featured ${itemType}`,
    });
  }

  const defaultColumns: GridColumns = { default: 1, sm: 2, md: 2, lg: 3, xl: 4 };
  const gridColumns = columns || defaultColumns;

  if (sidebar) {
    return (
      <section className={cn('space-y-6', className)}>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">
              {title && (
                <div className="space-y-3">
                  <h2 className="font-bold text-2xl leading-tight tracking-tight lg:text-3xl">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {sidebar}
            </div>
          </aside>
          <div className="min-w-0">
            <GridList columns={gridColumns}>{children}</GridList>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('space-y-6', className)}>
      {title && (
        <SectionHeader
          actions={actions.length > 0 ? actions : undefined}
          description={description}
          title={title}
        />
      )}
      <GridList columns={gridColumns}>{children}</GridList>
    </section>
  );
}
