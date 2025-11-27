import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutSidebarProps extends useRender.ComponentProps<'aside'> {}

export function LayoutSidebar({ className, render, ...delegated }: LayoutSidebarProps) {
  const defaultProps = {
    className: cn(
      'space-y-6 md:nth-3:col-span-2 lg:sticky lg:top-8 lg:nth-3:col-span-1 lg:h-fit',
      className,
    ),
  };

  return useRender({
    defaultTagName: 'aside',
    props: mergeProps<'aside'>(defaultProps, delegated),
    render,
  });
}
