import { SidebarSection } from '@/components/layouts/sidebar-section';
import { cn } from '@/utils';
import { GridList } from './grid-list';

type GridColumns = {
  default?: 1 | 2 | 3 | 4 | 5;
  lg?: 1 | 2 | 3 | 4 | 5;
  md?: 1 | 2 | 3 | 4 | 5;
  sm?: 1 | 2 | 3 | 4 | 5;
  xl?: 1 | 2 | 3 | 4 | 5;
};

type NavItem = {
  href: string;
  label: string;
};

type FeaturedGridProps = {
  children: React.ReactNode;
  className?: string;
  columns?: GridColumns;
  description?: string;
  quickLinks?: NavItem[];
  title?: string;
};

export function FeaturedGrid({
  children,
  className,
  columns,
  description,
  quickLinks,
  title,
}: FeaturedGridProps) {
  const defaultColumns: GridColumns = { default: 1, sm: 2, md: 2, lg: 3, xl: 4 };
  const gridColumns = columns || defaultColumns;

  return (
    <section className={cn('space-y-6', className)}>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-6">
            <header className="space-y-3">
              <h2 className="font-semibold text-2xl leading-tight tracking-tight">{title}</h2>
              {description && (
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {description}
                </p>
              )}
            </header>
            {quickLinks && <SidebarSection navItems={quickLinks} title="Quick Links" />}
          </div>
        </aside>

        <div className="min-w-0">
          <GridList columns={gridColumns}>{children}</GridList>
        </div>
      </div>
    </section>
  );
}
