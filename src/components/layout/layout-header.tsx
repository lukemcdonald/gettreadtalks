import { cn } from '@/utils';

type LayoutHeaderProps = {
  children?: React.ReactNode;
  className?: string;
  render?: React.ReactNode;
};

export function LayoutHeader({ children, className, render }: LayoutHeaderProps) {
  return (
    <div className={cn('order-first', className)} data-slot="layout-header">
      {render || children}
    </div>
  );
}
