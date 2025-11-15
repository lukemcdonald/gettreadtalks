import { cn } from '@/lib/utils';

type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-lg border bg-muted/50 p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
