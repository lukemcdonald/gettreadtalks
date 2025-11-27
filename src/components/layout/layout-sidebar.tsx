import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';

import { cn } from '@/utils';

interface LayoutSidebarProps extends useRender.ComponentProps<'div'> {
  priority?: boolean;
  sticky?: boolean;
}

export function LayoutSidebar({
  className,
  priority,
  render,
  sticky,
  ...delegated
}: LayoutSidebarProps) {
  const defaultProps = {
    className: cn('space-y-6', sticky && 'md:sticky md:top-20 md:h-fit', className),
    'data-slot': 'layout-sidebar',
  };

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, delegated),
    render,
  });
}
