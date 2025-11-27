import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutHeaderProps extends useRender.ComponentProps<'div'> {}

export function LayoutHeader({ className, render, ...delegated }: LayoutHeaderProps) {
  const defaultProps = {
    className: cn('order-first col-span-full', className),
    'data-slot': 'layout-header',
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
