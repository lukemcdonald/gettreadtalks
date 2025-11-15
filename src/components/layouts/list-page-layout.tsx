import { cn } from '@/lib/utils';

type ListPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function ListPageLayout({ children, className }: ListPageLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl space-y-12">{children}</div>
    </div>
  );
}
