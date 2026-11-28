import type { ReactNode } from 'react';

import { cn } from '@/utils';

/** `column` sits beside main content; `row` spans the page when there is no main content. */
export type MetadataSidebarLayout = 'column' | 'row';

const LAYOUT_CLASS_NAME: Record<MetadataSidebarLayout, string> = {
  column: 'lg:flex-col lg:gap-8',
  row: 'sm:justify-center',
};

export function MetadataSidebar({
  children,
  layout,
}: {
  children: ReactNode;
  layout: MetadataSidebarLayout;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12',
        LAYOUT_CLASS_NAME[layout]
      )}
    >
      {children}
    </div>
  );
}

const ACTIONS_CLASS_NAME: Record<MetadataSidebarLayout, string> = {
  column: 'grid grid-cols-2 gap-2 *:w-full *:first:col-span-2',
  row: 'flex flex-wrap gap-2',
};

/** Column stacks the first action full width over a two-up grid; row keeps them inline. */
export function MetadataSidebarActions({
  children,
  layout,
}: {
  children: ReactNode;
  layout: MetadataSidebarLayout;
}) {
  return <div className={ACTIONS_CLASS_NAME[layout]}>{children}</div>;
}
