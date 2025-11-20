import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface ContainerProps extends useRender.ComponentProps<'div'> {}

export function Container({ className, render, ...delegated }: ContainerProps) {
  const defaultProps = {
    'data-slot': 'container',
    className: cn('container', className),
  };

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, delegated),
  });
}
