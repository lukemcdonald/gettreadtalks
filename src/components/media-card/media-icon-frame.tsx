import type { ReactNode } from 'react';

export function MediaIconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md">
      {children}
    </div>
  );
}
