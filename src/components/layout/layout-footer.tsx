import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutFooterProps extends useRender.ComponentProps<'div'> {}

export function LayoutFooter({ className, render, ...delegated }: LayoutFooterProps) {
  const defaultProps = {
    className: cn('order-last col-span-full', className),
    'data-slot': 'layout-footer',
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
