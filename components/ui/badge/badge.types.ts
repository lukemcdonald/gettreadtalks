import type { VariantProps } from 'tailwind-variants';
import type { badgeVariants } from './badge';

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariants {}
