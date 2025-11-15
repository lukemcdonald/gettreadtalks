import { cn } from '@/lib/utils';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('w-full px-4 pt-6 pb-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}
