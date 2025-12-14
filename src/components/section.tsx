import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

interface SectionProps extends useRender.ComponentProps<'section'> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sectionVariants = cva('space-y-6 px-4 sm:px-6', {
  variants: {
    spacing: {
      xs: 'py-2',
      sm: 'py-3',
      md: 'py-4',
      lg: 'py-4 sm:py-6',
      xl: 'py-4 sm:py-6 md:py-12',
    },
  },
});

export function Section({ className, render, spacing, ...delegated }: SectionProps) {
  const defaultProps = {
    // 'data-slot': 'section',
    className: cn(sectionVariants({ spacing }), className),
  };

  return useRender({
    defaultTagName: 'section',
    render,
    props: mergeProps<'section'>(defaultProps, delegated),
  });
}
