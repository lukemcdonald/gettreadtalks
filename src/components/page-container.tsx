import type { ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const pageContainerVariants = cva('w-full', {
  defaultVariants: {
    width: 'default',
  },
  variants: {
    width: {
      default: 'max-w-4xl',
      narrow: 'max-w-2xl',
    },
  },
});

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  width?: 'default' | 'narrow';
}

export function PageContainer({
  children,
  className,
  width = 'default',
}: PageContainerProps) {
  return (
    <div className={cn(pageContainerVariants({ width }), className)}>
      {children}
    </div>
  );
}
