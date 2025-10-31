import type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps } from './card.types';

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
      contained: '',
      outlined: 'border border-base-300',
      elevated: 'shadow-lg',
    },
  },
  defaultVariants: {
    padding: 'md',
    variant: 'contained',
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

export function Card({ className, padding, variant, ...props }: CardProps) {
  return <div className={cardVariants({ className, padding, variant })} {...props} />;
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cardHeaderVariants({ className })} {...props} />;
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cardContentVariants({ className })} {...props} />;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cardFooterVariants({ className })} {...props} />;
}
