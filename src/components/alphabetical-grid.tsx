import { cn } from '@/utils';
import { GridList } from './grid-list';

type AlphabeticalGroup = {
  items: React.ReactNode[];
  letter: string;
  range: string;
};

type AlphabeticalGridProps = {
  className?: string;
  groups: AlphabeticalGroup[];
};

export function AlphabeticalGrid({ className, groups }: AlphabeticalGridProps) {
  return (
    <div className={cn('space-y-12', className)}>
      {groups.map((group) => (
        <section className="space-y-6" key={group.letter}>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-2xl">{group.letter}</h2>
            <span className="text-muted-foreground text-sm">{group.range}</span>
          </div>
          <GridList columns={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>{group.items}</GridList>
        </section>
      ))}
    </div>
  );
}
