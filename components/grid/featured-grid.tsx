import { SectionHeader } from '@/components/layouts';
import { cn } from '@/lib/utils';
import { GridList } from './grid-list';

const FEATURED_PREFIX_REGEX = /^Featured\s+/;

type FeaturedGridProps = {
  allHref?: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  featuredHref?: string;
  itemCount?: number;
  title?: string;
};

export function FeaturedGrid({
  allHref,
  children,
  className,
  description,
  featuredHref,
  itemCount,
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

  const displayTitle = itemCount !== undefined ? `${title} (${itemCount})` : title;

  return (
    <section className={cn('space-y-6', className)}>
      {title && (
        <SectionHeader
          actions={actions.length > 0 ? actions : undefined}
          description={description}
          title={displayTitle || ''}
        />
      )}
      <GridList columns={{ default: 1, sm: 2, md: 2, lg: 3, xl: 4 }}>{children}</GridList>
    </section>
  );
}
