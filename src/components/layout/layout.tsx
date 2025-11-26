import type { ReactNode } from 'react';

import { Children, isValidElement } from 'react';

import { cn } from '@/utils';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

type SidebarProps = {
  children: ReactNode;
  className?: string;
};

type ContentProps = {
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
    (child) => isValidElement(child) && child.type === Sidebar,
  ).length;

  // Default to dual-sidebar layout for 2+ sidebars
  const gridClass = GRID_CLASSES[sidebarCount] ?? GRID_CLASSES[2];

  return <div className={cn('grid gap-8', gridClass, className)}>{children}</div>;
}

function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'space-y-6 md:nth-3:col-span-2 lg:sticky lg:top-8 lg:nth-3:col-span-1 lg:h-fit',
        className,
      )}
    >
      {children}
    </aside>
  );
}

function Content({ children, className }: ContentProps) {
  return <main className={cn('min-w-0 space-y-6', className)}>{children}</main>;
}

Layout.Content = Content;
Layout.Sidebar = Sidebar;

export { Layout };
