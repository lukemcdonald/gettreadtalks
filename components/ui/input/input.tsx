import type { InputProps } from './input.types';

import { tv } from 'tailwind-variants';

export const inputVariants = tv({
  base: 'flex w-full rounded-lg border bg-base-100 px-3 py-2 text-base-content ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-content/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    size: {
      lg: 'h-12 px-4 text-lg',
      md: 'h-10 px-3 text-base',
      sm: 'h-8 px-2 text-sm',
    },
    variant: {
      base: 'border-base-300 focus-visible:ring-primary',
      error: 'border-error focus-visible:ring-error',
      info: 'border-info focus-visible:ring-info',
      success: 'border-success focus-visible:ring-success',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'base',
  },
});

export function Input({ className, size, type, variant, ...props }: InputProps) {
  return <input className={inputVariants({ className, size, variant })} type={type} {...props} />;
}
