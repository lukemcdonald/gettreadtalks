import type { TextProps } from './text.types';

import { forwardRef } from 'react';

import { tv } from 'tailwind-variants';

export const textVariants = tv({
  base: 'text-base-content',
  variants: {
    color: {
      accent: 'text-accent',
      error: 'text-error',
      info: 'text-info',
      neutral: 'text-neutral',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
    },
    size: {
      base: 'text-base',
      lg: 'text-lg',
      sm: 'text-sm',
      xl: 'text-xl',
      xs: 'text-xs',
    },
    weight: {
      bold: 'font-bold',
      light: 'font-light',
      medium: 'font-medium',
      normal: 'font-normal',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
  },
});

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ as: Component = 'span', className, color, size, weight, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={textVariants({ className, color, size, weight })}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';
