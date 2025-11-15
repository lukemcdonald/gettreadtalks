import { cn } from '@/lib/utils';
import { SidebarContent } from './sidebar-content';

type ArchiveSidebarProps = {
  children?: React.ReactNode;
  className?: string;
  description?: string;
  meta?: Array<{ label: string; value: string | number }>;
  title?: string;
};

export function ArchiveSidebar({
  children,
  className,
  description,
  meta,
  title,
}: ArchiveSidebarProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <SidebarContent title={title}>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </SidebarContent>
      )}

      {meta && meta.length > 0 && (
        <SidebarContent title="About">
          <div className="space-y-2 text-sm">
            {meta.map((item) => (
              <div key={item.label}>
                <span className="font-medium">{item.label}:</span>{' '}
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </SidebarContent>
      )}

      {children}
    </div>
  );
}
