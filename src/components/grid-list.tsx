import { cn } from '@/utils';

type GridListProps = {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: 1 | 2 | 3 | 4 | 5;
    lg?: 1 | 2 | 3 | 4 | 5;
    md?: 1 | 2 | 3 | 4 | 5;
    sm?: 1 | 2 | 3 | 4 | 5;
    xl?: 1 | 2 | 3 | 4 | 5;
  };
};

const gridColsClassMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const smGridColsClassMap = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
};

const mdGridColsClassMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
};

const lgGridColsClassMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

const xlGridColsClassMap = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
};

export function GridList({ children, className, columns }: GridListProps) {
  const {
    default: defaultCols = 1,
    sm: smCols = 2,
    md: mdCols = 2,
    lg: lgCols = 3,
    xl: xlCols = 4,
  } = columns || {};

  return (
    <div
      className={cn(
        'grid',
        defaultCols === 1 ? 'gap-4' : 'gap-6',
        gridColsClassMap[defaultCols],
        smCols && smGridColsClassMap[smCols],
        mdCols && mdGridColsClassMap[mdCols],
        lgCols && lgGridColsClassMap[lgCols],
        xlCols && xlGridColsClassMap[xlCols],
        className,
      )}
    >
      {children}
    </div>
  );
}
