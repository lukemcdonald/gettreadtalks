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
      lg: 'py-4 sm:py-6',
      md: 'py-4',
      sm: 'py-3',
      xl: 'py-4 sm:py-6 md:py-12',
      xs: 'py-2',
    },
  },
});

export function Container({
  className,
  spacing,
  render,
  ...delegated
}: ContainerProps) {
  const defaultProps = {
    className: cn(containerVariants({ spacing }), className),
    'data-slot': 'container',
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
