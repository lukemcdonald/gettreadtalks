import type { ReactNode } from 'react';

interface ManagePageHeaderProps {
  action?: ReactNode;
  title: string;
}

export function ManagePageHeader({ action, title }: ManagePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <h1 className="min-w-0 text-2xl tracking-tight whitespace-nowrap">
        {title}
      </h1>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
