import type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps } from './card.types';

import { forwardRef } from 'react';

import { tv } from 'tailwind-variants';

export const cardVariants = tv({
  base: 'rounded-lg bg-base-100 text-base-content',
  variants: {
    padding: {
      lg: 'p-8',
      md: 'p-6',
      none: 'p-0',
      sm: 'p-4',
    },
    variant: {
      base: '',
      bordered: 'border border-base-300',
      elevated: 'shadow-lg',
    },
  },
  defaultVariants: {
    padding: 'md',
    variant: 'base',
  },
});

export const cardHeaderVariants = tv({
  base: 'flex flex-col space-y-1.5',
});

export const cardContentVariants = tv({
  base: '',
});

export const cardFooterVariants = tv({
  base: 'flex items-center',
});

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, variant, ...props }, ref) => {
    return <div ref={ref} className={cardVariants({ className, padding, variant })} {...props} />;
  },
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cardHeaderVariants({ className })} {...props} />;
  },
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cardContentVariants({ className })} {...props} />;
  },
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cardFooterVariants({ className })} {...props} />;
  },
);

CardFooter.displayName = 'CardFooter';
