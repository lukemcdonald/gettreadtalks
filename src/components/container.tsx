import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

interface ContainerProps extends useRender.ComponentProps<'div'> {
  py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const containerVariants = cva('container', {
  variants: {
    py: {
      xs: 'py-2',
      sm: 'py-3',
      md: 'py-4',
      lg: 'py-4 sm:py-6',
      xl: 'py-4 sm:py-6 md:py-12',
    },
  },
});

export function Container({ className, py, render, ...delegated }: ContainerProps) {
  const defaultProps = {
    'data-slot': 'container',
    className: cn(containerVariants({ py }), className),
  };

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, delegated),
  });
}
