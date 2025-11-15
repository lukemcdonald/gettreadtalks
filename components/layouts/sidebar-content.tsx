import { cn } from '@/lib/utils';

type SidebarContentProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function SidebarContent({ children, className, title }: SidebarContentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="font-semibold text-lg">{title}</h3>}
      <div className="space-y-2">{children}</div>
    </div>
  );
}
