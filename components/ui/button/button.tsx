import type { ButtonProps } from './button.types';

import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    size: {
      lg: 'h-12 px-6 text-lg',
      md: 'h-10 px-4 text-base',
      sm: 'h-8 px-3 text-sm',
    },
    variant: {
      accent: 'bg-accent text-accent-content hover:bg-accent/90',
      error: 'bg-error text-error-content hover:bg-error/90',
      ghost: 'hover:bg-base-200 text-base-content',
      neutral: 'bg-neutral text-neutral-content hover:bg-neutral/90',
      outline: 'border-2 border-neutral bg-transparent text-base-content hover:bg-base-200',
      primary: 'bg-primary text-primary-content hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-content hover:bg-secondary/90',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'neutral',
  },
});

export function Button({ className, size, variant, ...delegated }: ButtonProps) {
  return <button className={buttonVariants({ className, size, variant })} {...delegated} />;
}
