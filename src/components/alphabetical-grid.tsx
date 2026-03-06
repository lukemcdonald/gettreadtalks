import type { ReactNode } from 'react';

import { cn } from '@/utils';
import { GridList } from './grid-list';
import { SectionHeading } from './section-heading';

interface AlphabeticalGroup {
  items: ReactNode[];
  letter: string;
  range: string;
}

interface AlphabeticalGridProps {
  className?: string;
  groups: AlphabeticalGroup[];
}

export function AlphabeticalGrid({ className, groups }: AlphabeticalGridProps) {
  return (
    <div className={cn('space-y-6 md:space-y-12', className)}>
      {groups.map((group) => (
        <section className="space-y-3 md:space-y-6" key={group.letter}>
          <SectionHeading heading={group.letter} meta={group.range} />
          <GridList columns={{ default: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>{group.items}</GridList>
        </section>
      ))}
    </div>
  );
}
