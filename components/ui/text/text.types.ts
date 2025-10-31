import type { VariantProps } from 'tailwind-variants';

import type { textVariants } from './text';

export type TextVariants = VariantProps<typeof textVariants>;

export interface TextProps
	extends React.HTMLAttributes<HTMLElement>,
		TextVariants {
	as?: 'div' | 'label' | 'p' | 'span';
}
