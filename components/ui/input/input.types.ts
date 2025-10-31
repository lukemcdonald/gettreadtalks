import type { VariantProps } from 'tailwind-variants';
import type { inputVariants } from './input';

export type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InputVariants {}
