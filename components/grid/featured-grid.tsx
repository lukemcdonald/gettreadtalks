import { cn } from '@/lib/utils';
import { GridList } from './grid-list';

type FeaturedGridProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  viewAllHref?: string;
};

export function FeaturedGrid({ children, className, title, viewAllHref }: FeaturedGridProps) {
  return (
    <section className={cn('space-y-6', className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">{title}</h2>
          {viewAllHref && (
            <a
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href={viewAllHref}
            >
              View All →
            </a>
          )}
        </div>
      )}
      <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>{children}</GridList>
    </section>
  );
}
