import { cn } from '@/utils';

type PageHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function PageHeader({ children, className, description, title }: PageHeaderProps) {
  return (
    <header className={cn('space-y-2', className)}>
      <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
      {children}
    </header>
  );
}
