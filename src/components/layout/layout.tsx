import type { ReactNode } from 'react';

import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '@/utils';
import { LayoutContent } from './layout-content';
import { LayoutHeader } from './layout-header';
import { LayoutSidebar } from './layout-sidebar';

const GRID_CLASSES: Record<number, string> = {
  0: 'grid-cols-1',
  1: 'md:grid-cols-12',
};

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export function Layout({ children, className }: LayoutProps) {
  const childrenArray = Children.toArray(children);

  let sidebarCount = 0;
  const enhancedChildren = childrenArray.map((child) => {
    if (isValidElement(child) && child.type === LayoutSidebar) {
      const position = sidebarCount === 0 ? 'primary' : 'secondary';
      sidebarCount += 1;
      return cloneElement(child, {
        'data-position': position,
      } as Record<string, 'primary' | 'secondary'>);
    }
    return child;
  });

  const gridClass = GRID_CLASSES[sidebarCount] ?? GRID_CLASSES[1];

  return (
    <div className={cn('grid gap-6', gridClass, className)} data-sidebar-count={sidebarCount}>
      {enhancedChildren}
    </div>
  );
}

Layout.Content = LayoutContent;
Layout.Header = LayoutHeader;
Layout.Sidebar = LayoutSidebar;
