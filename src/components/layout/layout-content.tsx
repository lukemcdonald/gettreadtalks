import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutContentProps extends useRender.ComponentProps<'div'> {}

export function LayoutContent({ className, render, ...delegated }: LayoutContentProps) {
  const defaultProps = {
    className: cn('min-w-0 space-y-6', className),
    'data-slot': 'layout-content',
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
