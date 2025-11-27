import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutContentProps extends useRender.ComponentProps<'div'> {}

export function LayoutContent({ className, render, ...delegated }: LayoutContentProps) {
  const defaultProps = {
    'data-slot': 'layout-content',
    className: cn(
      'col-span-full min-w-0 space-y-6',
      // Default: 9 cols on md+
      'md:col-span-9',
      // Dual sidebar override: 6 cols on lg
      'lg:[div[data-sidebar-count="2"]_&]:col-span-6',
      className,
    ),
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
