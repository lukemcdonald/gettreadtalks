import type { ReactNode } from 'react';

import { cn } from '@/utils';
import { GridList } from './grid-list';

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
          <h2 className="flex items-center gap-4 text-lg">
            <span className="font-bold">{group.letter}</span>
            <hr className="grow border-border border-t border-dashed" />
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
              {group.range}
            </span>
          </h2>
          <GridList columns={{ default: 1, sm: 2, md: 2, lg: 3, xl: 3 }}>{group.items}</GridList>
        </section>
      ))}
    </div>
  );
}
