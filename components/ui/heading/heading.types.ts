import type { VariantProps } from 'tailwind-variants';
import type { headingVariants } from './heading';

export type HeadingVariants = VariantProps<typeof headingVariants>;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, HeadingVariants {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
