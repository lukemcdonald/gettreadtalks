import type { ReactNode } from 'react';

import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/utils';
import { LayoutContent } from './layout-content';
import { LayoutSidebar } from './layout-sidebar';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const GRID_CLASSES: Record<number, string> = {
  0: 'grid-cols-1',
  1: 'md:grid-cols-12',
  2: 'md:grid-cols-12',
};

function Layout({ children, className }: LayoutProps) {
  const childrenArray = Children.toArray(children);

  // Count sidebars and enhance them with data-position
  let sidebarCount = 0;
  const enhancedChildren = childrenArray.map((child) => {
    if (isValidElement(child) && child.type === LayoutSidebar) {
      const position = sidebarCount === 0 ? 'primary' : 'secondary';
      sidebarCount++;
      return cloneElement(child, { 'data-position': position } as any);
    }
    return child;
  });

  const gridClass = GRID_CLASSES[sidebarCount] ?? GRID_CLASSES[2];

  return (
    <div className={cn('grid gap-6', gridClass, className)} data-sidebar-count={sidebarCount}>
      {enhancedChildren}
    </div>
  );
}

Layout.Content = LayoutContent;
Layout.Sidebar = LayoutSidebar;

export { Layout };
