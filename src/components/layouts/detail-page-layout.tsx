import { cn } from '@/lib/utils';

type DetailPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function DetailPageLayout({ children, className }: DetailPageLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-5xl space-y-12">{children}</div>
    </div>
  );
}
