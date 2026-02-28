import type { ReactNode } from 'react';

import { cn } from '@/utils';

export type ColumnCount = 1 | 2 | 3;
export type GapSize = 'normal' | 'relaxed';

export interface GridColumns {
  default?: ColumnCount;
  lg?: ColumnCount;
  md?: ColumnCount;
  sm?: ColumnCount;
  xl?: ColumnCount;
}

interface GridListProps {
  children: ReactNode;
  className?: string;
  columns?: GridColumns;
  /** Use container queries instead of viewport queries */
  container?: boolean;
  gap?: GapSize;
}

/** Viewport-based responsive classes */
const VIEWPORT_CLASSES = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  },
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
  },
} as const;

/** Container query responsive classes */
const CONTAINER_CLASSES = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  },
  sm: {
    1: '@sm:grid-cols-1',
    2: '@sm:grid-cols-2',
    3: '@sm:grid-cols-3',
  },
  md: {
    1: '@md:grid-cols-1',
    2: '@md:grid-cols-2',
    3: '@md:grid-cols-3',
  },
  lg: {
    1: '@lg:grid-cols-1',
    2: '@lg:grid-cols-2',
    3: '@lg:grid-cols-3',
  },
  xl: {
    1: '@xl:grid-cols-1',
    2: '@xl:grid-cols-2',
    3: '@xl:grid-cols-3',
  },
} as const;

const GAP_CLASSES = {
  normal: 'gap-2 sm:gap-3 md:gap-4',
  relaxed: 'gap-2 sm:gap-4 md:gap-6',
} as const;

export function GridList({
  children,
  className,
  columns,
  container = false,
  gap = 'normal',
}: GridListProps) {
  const {
    default: defaultCols = 1,
    sm: smCols,
    md: mdCols,
    lg: lgCols,
    xl: xlCols,
  } = columns || {};

  const classes = container ? CONTAINER_CLASSES : VIEWPORT_CLASSES;

  return (
    <div
      className={cn(
        'grid',
        container && '@container',
        GAP_CLASSES[gap],
        classes.cols[defaultCols],
        smCols && classes.sm[smCols],
        mdCols && classes.md[mdCols],
        lgCols && classes.lg[lgCols],
        xlCols && classes.xl[xlCols],
        className,
      )}
    >
      {children}
    </div>
  );
}
