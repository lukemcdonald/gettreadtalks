import type { ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const titleVariants = cva('tracking-tight text-balance', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'font-base text-4xl sm:text-5xl lg:text-6xl',
      md: 'font-base text-3xl sm:text-4xl',
      sm: 'text-2xl',
    },
  },
});

const descriptionVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      lg: 'mt-4 text-xl sm:text-2xl',
      md: 'mt-3 text-xl',
      sm: 'text-base',
    },
  },
});

interface PageHeaderProps {
  className?: string;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  title: string;
}

export function PageHeader({
  className,
  description,
  size = 'md',
  title,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="max-w-prose space-y-2">
        <h1 className={titleVariants({ size })}>{title}</h1>
        {!!description && (
          <div className={descriptionVariants({ size })}>{description}</div>
        )}
      </div>
    </header>
  );
}
