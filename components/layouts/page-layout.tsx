import { cn } from '@/lib/utils';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-12 sm:px-6 lg:px-8', className)}>{children}</div>
  );
}
