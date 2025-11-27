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
  1: 'lg:grid-cols-[minmax(250px,1fr)_3fr]',
  2: 'md:grid-cols-[minmax(200px,1fr)_2fr] lg:grid-cols-[minmax(200px,1fr)_2fr_minmax(200px,1fr)]',
};

function Layout({ children, className }: LayoutProps) {
  // Count sidebars to determine grid layout
  const childrenArray = Children.toArray(children);
  const sidebarCount = childrenArray.filter(
    (child) => isValidElement(child) && child.type === LayoutSidebar,
  ).length;

  // Default to dual-sidebar layout for 2+ sidebars
  const gridClass = GRID_CLASSES[sidebarCount] ?? GRID_CLASSES[2];

  return <div className={cn('grid gap-8', gridClass, className)}>{children}</div>;
}

Layout.Content = LayoutContent;
Layout.Sidebar = LayoutSidebar;

export { Layout };
