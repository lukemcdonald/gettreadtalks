import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface ContainerProps extends useRender.ComponentProps<'div'> {}

// TODO: Add variant to add py padding (often py-12). Maybe other variants, too?
export function Container({ className, render, children, ...delegated }: ContainerProps) {
  const defaultProps = {
    'data-slot': 'container',
    children: <div className="mx-auto max-w-7xl">{children}</div>,
    className: cn('p-4 sm:px-6', className),
  };

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, delegated),
  });
}
