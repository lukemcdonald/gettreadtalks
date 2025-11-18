import { cn } from '@/lib/utils';
import { type BreadcrumbItem, Breadcrumbs } from './breadcrumbs';

type PageHeaderProps = {
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function PageHeader({
  actions,
  breadcrumbs,
  children,
  className,
  description,
  title,
}: PageHeaderProps) {
  return (
    <header className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
