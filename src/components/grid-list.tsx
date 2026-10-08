import type { ReactNode } from 'react';

import { cn } from '@/utils';

type ColumnCount = 1 | 2 | 3;
type GapSize = 'normal' | 'relaxed';

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
  gap?: GapSize;
}

const COLUMN_CLASSES = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  },
  lg: {
    1: '@lg:grid-cols-1',
    2: '@lg:grid-cols-2',
    3: '@lg:grid-cols-3',
  },
  md: {
    1: '@md:grid-cols-1',
    2: '@md:grid-cols-2',
    3: '@md:grid-cols-3',
  },
  sm: {
    1: '@sm:grid-cols-1',
    2: '@sm:grid-cols-2',
    3: '@sm:grid-cols-3',
  },
  xl: {
    1: '@xl:grid-cols-1',
    2: '@xl:grid-cols-2',
    3: '@xl:grid-cols-3',
  },
} as const;

const GAP_CLASSES = {
  normal: 'gap-2 @sm:gap-3 @md:gap-4',
  relaxed: 'gap-2 @sm:gap-4 @md:gap-6',
} as const;

export function GridList({
  children,
  className,
  columns,
  gap = 'normal',
}: GridListProps) {
  const {
    default: defaultCols = 1,
    lg: lgCols,
    md: mdCols,
    sm: smCols,
    xl: xlCols,
  } = columns || {};

  return (
    <div className="@container w-full min-w-0">
      <div
        className={cn(
          'grid',
          GAP_CLASSES[gap],
          COLUMN_CLASSES.cols[defaultCols],
          smCols && COLUMN_CLASSES.sm[smCols],
          mdCols && COLUMN_CLASSES.md[mdCols],
          lgCols && COLUMN_CLASSES.lg[lgCols],
          xlCols && COLUMN_CLASSES.xl[xlCols],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
