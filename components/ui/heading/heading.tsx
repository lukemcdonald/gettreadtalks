import { forwardRef } from 'react';

import { tv } from 'tailwind-variants';

import type { HeadingProps } from './heading.types';

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
			'xl': 'text-xl',
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

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
	({ as: Component = 'h2', className, color, size, weight, ...props }, ref) => {
		return (
			<Component
				ref={ref}
				className={headingVariants({ className, color, size, weight })}
				{...props}
			/>
		);
	},
);

Heading.displayName = 'Heading';
