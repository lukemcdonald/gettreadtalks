import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutHeaderProps extends useRender.ComponentProps<'div'> {}

export function LayoutHeader({ className, render, ...delegated }: LayoutHeaderProps) {
  const defaultProps = {
    className: cn('col-span-full', className),
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
