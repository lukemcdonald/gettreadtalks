import type { ReactNode } from 'react';

import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/utils';
import { LayoutContent } from './layout-content';
import { LayoutFooter } from './layout-footer';
import { LayoutHeader } from './layout-header';
import { LayoutSidebar } from './layout-sidebar';

const ORDER_CLASSES: Record<number, string> = {
  1: 'order-[-10] md:order-none',
  2: 'order-[-20] md:order-none',
  3: 'order-[-30] md:order-none',
  4: 'order-[-40] md:order-none',
};

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export function Layout({ children, className }: LayoutProps) {
  const childrenArray = Children.toArray(children);

  let priorityIndex = 0;
  let sidebarCount = 0;

  const enhancedChildren = childrenArray.map((child) => {
    if (!isValidElement(child)) {
      return child;
    }

    const props: Record<string, unknown> = {};
    const childProps = child.props as {
      className?: string;
      priority?: boolean;
      style?: React.CSSProperties;
    };

    // Count sidebars for layout detection
    if (child.type === LayoutSidebar) {
      sidebarCount += 1;
    }

    // Calculate priority order for any child with priority prop
    if (childProps.priority) {
      priorityIndex += 1;
      const priorityLevel = childrenArray.length - priorityIndex + 1;
      const orderClass = ORDER_CLASSES[priorityLevel];

      if (orderClass) {
        props.className = cn(childProps.className, orderClass);
      }
    }

    // Only clone if we have props to inject
    return Object.keys(props).length > 0 ? cloneElement(child, props) : child;
  });

  return (
    <div
      className={cn('grid grid-cols-[var(--layout-grid-columns)] gap-6', className)}
      data-sidebar-count={sidebarCount}
      data-slot="layout"
    >
      {enhancedChildren}
    </div>
  );
}

Layout.Content = LayoutContent;
Layout.Footer = LayoutFooter;
Layout.Header = LayoutHeader;
Layout.Sidebar = LayoutSidebar;
