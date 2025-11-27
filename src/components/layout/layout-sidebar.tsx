import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutSidebarProps extends useRender.ComponentProps<'div'> {}

export function LayoutSidebar({ className, render, ...delegated }: LayoutSidebarProps) {
  const defaultProps = {
    className: cn(
      'col-span-full space-y-6',
      // All sidebars default to 3 cols on md+, sticky behavior
      // top-20 = 5rem = 80px (accounts for site header + gap)
      'md:sticky md:top-20 md:col-span-3 md:h-fit',
      // Secondary sidebar: full width on md, back to 3 on lg
      'md:[&[data-position="secondary"]]:col-span-full',
      'lg:[&[data-position="secondary"]]:col-span-3',
      className,
    ),
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
