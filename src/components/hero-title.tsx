import type { ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const heroTitleVariants = cva('font-semibold tracking-tight', {
  variants: {
    size: {
      sm: 'text-2xl sm:text-3xl lg:text-4xl',
      md: 'text-3xl sm:text-4xl lg:text-5xl',
      lg: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HeroTitle({ children, className, size }: HeroTitleProps) {
  return <h1 className={cn(heroTitleVariants({ size }), className)}>{children}</h1>;
}
