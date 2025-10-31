import type { VariantProps } from 'tailwind-variants';
import type { buttonVariants } from './button';

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  ref?: React.Ref<HTMLButtonElement>;
}
