import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutContentProps extends useRender.ComponentProps<'main'> {}

export function LayoutContent({ className, render, ...delegated }: LayoutContentProps) {
  const defaultProps = {
    className: cn('min-w-0 space-y-6', className),
  };

  return useRender({
    defaultTagName: 'main',
    props: mergeProps<'main'>(defaultProps, delegated),
    render,
  });
}
