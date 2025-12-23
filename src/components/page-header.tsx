import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

type PageHeaderProps = {
  className?: string;
  description?: string;
  variant?: 'sm' | 'md' | 'lg';
  title: string;
};

const titleVariants = cva('text-balance tracking-tight', {
  variants: {
    variant: {
      sm: 'text-2xl',
      md: 'font-base text-4xl',
      lg: 'font-base text-6xl',
    },
  },
  defaultVariants: {
    variant: 'md',
  },
});

const descriptionVariants = cva('text-muted-foreground', {
  variants: {
    variant: {
      sm: 'text-base',
      md: 'mt-3 text-xl',
      lg: 'mt-4 text-2xl',
    },
  },
});

export function PageHeader({ className, description, title, variant = 'md' }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="max-w-prose space-y-2">
        <h1 className={titleVariants({ variant })}>{title}</h1>
        {!!description && <p className={descriptionVariants({ variant })}>{description}</p>}
      </div>
    </header>
  );
}
