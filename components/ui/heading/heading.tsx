import type { HeadingProps } from './heading.types';

import { tv } from 'tailwind-variants';

export const headingVariants = tv({
  base: 'text-base-content font-bold tracking-tight',
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
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      xl: 'text-xl',
    },
    weight: {
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: '2xl',
    weight: 'bold',
  },
});

export function Heading({
  as: Component = 'h2',
  className,
  color,
  size,
  weight,
  ...props
}: HeadingProps) {
  return <Component className={headingVariants({ className, color, size, weight })} {...props} />;
}
