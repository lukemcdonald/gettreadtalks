import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

interface SectionProps extends useRender.ComponentProps<'section'> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const sectionVariants = cva('gap-6 px-4 sm:px-6', {
  variants: {
    spacing: {
      '2xl': 'py-4 sm:py-6 md:py-12 lg:py-16',
      '3xl': 'xl:20 py-4 sm:py-6 md:py-12 lg:py-16',
      lg: 'py-4 sm:py-6',
      md: 'py-4',
      sm: 'py-3',
      xl: 'py-4 sm:py-6 md:py-12',
      xs: 'py-2',
    },
  },
});

export function Section({
  className,
  render,
  spacing,
  ...delegated
}: SectionProps) {
  const defaultProps = {
    // 'data-slot': 'section',
    className: cn(sectionVariants({ spacing }), className),
  };

  return useRender({
    defaultTagName: 'section',
    props: mergeProps<'section'>(defaultProps, delegated),
    render,
  });
}
