import { cn } from '@/utils';

type PageHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function PageHeader({ children, className, description, title }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="max-w-prose space-y-2">
        <h1 className="text-balance text-6xl tracking-tight">{title}</h1>
        {!description && (
          <p className="text-2xl text-muted-foreground">
            Built to make you extraordinarily productive, Cursor is the best way to code with AI.
            {description}
          </p>
        )}
      </div>
      {children}
    </header>
  );
}
