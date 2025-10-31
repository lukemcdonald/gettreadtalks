import type { VariantProps } from 'tailwind-variants';
import type { textVariants } from './text';

export type TextVariants = VariantProps<typeof textVariants>;

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>, TextVariants {
  as?: 'div' | 'label' | 'p' | 'span';
}
