import type { ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const titleVariants = cva('text-balance tracking-tight', {
  variants: {
    size: {
      sm: 'text-2xl',
      md: 'font-base text-4xl',
      lg: 'font-base text-6xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const descriptionVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-base',
      md: 'mt-3 text-xl',
      lg: 'mt-4 text-2xl',
    },
  },
});

interface PageHeaderProps {
  className?: string;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  title: string;
}

export function PageHeader({ className, description, size = 'md', title }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="max-w-prose space-y-2">
        <h1 className={titleVariants({ size })}>{title}</h1>
        {!!description && <div className={descriptionVariants({ size })}>{description}</div>}
      </div>
    </header>
  );
}
