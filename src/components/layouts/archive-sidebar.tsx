import { cn } from '@/utils';

type ArchiveSidebarProps = {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function ArchiveSidebar({ children, className, description, title }: ArchiveSidebarProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <header className="space-y-2">
          <h2 className="font-semibold text-2xl">{title}</h2>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </header>
      )}

      {children}
    </div>
  );
}
