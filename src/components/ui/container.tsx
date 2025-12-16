import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

interface ContainerProps extends useRender.ComponentProps<'div'> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const containerVariants = cva('container', {
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

export function Container({ className, spacing, render, ...delegated }: ContainerProps) {
  const defaultProps = {
    'data-slot': 'container',
    className: cn(containerVariants({ spacing }), className),
  };

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, delegated),
  });
}
