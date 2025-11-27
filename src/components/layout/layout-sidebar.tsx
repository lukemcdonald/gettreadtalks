import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutSidebarProps extends useRender.ComponentProps<'aside'> {}

export function LayoutSidebar({ className, render, ...delegated }: LayoutSidebarProps) {
  const defaultProps = {
    className: cn(
      'col-span-full space-y-6',
      'md:col-span-3',
      // Sticky behavior
      'md:sticky md:top-8 md:h-fit',
      className,
      // Second sidebar: override to full width on md, back to 3 on lg
      'md:[div[data-sidebar-count="2"]_&:nth-of-type(2)]:col-span-full',
      'lg:[div[data-sidebar-count="2"]_&:nth-of-type(2)]:col-span-3',
    ),
  };

  return useRender({
    defaultTagName: 'aside',
    props: mergeProps<'aside'>(defaultProps, delegated),
    render,
  });
}
