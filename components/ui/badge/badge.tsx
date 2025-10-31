import { forwardRef } from 'react';

import { tv } from 'tailwind-variants';

import type { BadgeProps } from './badge.types';

export const badgeVariants = tv({
	base: 'inline-flex items-center rounded-full font-medium transition-colors',
	variants: {
		size: {
			lg: 'px-4 py-1.5 text-base',
			md: 'px-3 py-1 text-sm',
			sm: 'px-2 py-0.5 text-xs',
		},
		variant: {
			accent: 'bg-accent text-accent-content',
			error: 'bg-error text-error-content',
			info: 'bg-info text-info-content',
			neutral: 'bg-neutral text-neutral-content',
			primary: 'bg-primary text-primary-content',
			secondary: 'bg-secondary text-secondary-content',
			success: 'bg-success text-success-content',
			warning: 'bg-warning text-warning-content',
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'neutral',
	},
});

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, size, variant, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={badgeVariants({ className, size, variant })}
				{...props}
			/>
		);
	},
);

Badge.displayName = 'Badge';
