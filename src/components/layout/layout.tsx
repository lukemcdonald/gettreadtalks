import type { ReactNode } from 'react';

import { Children, isValidElement } from 'react';

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
  // Count sidebars to determine grid layout
  const childrenArray = Children.toArray(children);
  const sidebarCount = childrenArray.filter(
    (child) => isValidElement(child) && child.type === LayoutSidebar,
  ).length;

  const gridClass = GRID_CLASSES[sidebarCount] ?? GRID_CLASSES[2];

  return (
    <div className={cn('grid gap-6', gridClass, className)} data-sidebar-count={sidebarCount}>
      {children}
    </div>
  );
}

Layout.Content = LayoutContent;
Layout.Sidebar = LayoutSidebar;

export { Layout };
