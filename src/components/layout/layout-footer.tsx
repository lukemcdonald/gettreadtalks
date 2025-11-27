import { cn } from '@/utils';

interface LayoutFooterProps {
  children?: React.ReactNode;
  className?: string;
  render?: React.ReactNode;
}

export function LayoutFooter({ children, className, render }: LayoutFooterProps) {
  return (
    <div className={cn('order-last', className)} data-slot="layout-footer">
      {render || children}
    </div>
  );
}
