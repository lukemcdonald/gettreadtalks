import type { VariantProps } from 'tailwind-variants';

import type {
	cardContentVariants,
	cardFooterVariants,
	cardHeaderVariants,
	cardVariants,
} from './card';

export type CardVariants = VariantProps<typeof cardVariants>;
export type CardHeaderVariants = VariantProps<typeof cardHeaderVariants>;
export type CardContentVariants = VariantProps<typeof cardContentVariants>;
export type CardFooterVariants = VariantProps<typeof cardFooterVariants>;

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		CardVariants {}

export interface CardHeaderProps
	extends React.HTMLAttributes<HTMLDivElement>,
		CardHeaderVariants {}

export interface CardContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		CardContentVariants {}

export interface CardFooterProps
	extends React.HTMLAttributes<HTMLDivElement>,
		CardFooterVariants {}
