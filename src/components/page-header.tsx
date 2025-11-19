import { cn } from '@/utils';

type PageHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function PageHeader({ children, className, description, title }: PageHeaderProps) {
  return (
    <header className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
