import { cn } from '@/lib/utils';

type SidebarLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  main: React.ReactNode;
  sidebar: React.ReactNode;
};

export function SidebarLayout({ children, className, main, sidebar }: SidebarLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <main className="min-w-0 space-y-6">{main}</main>
        </div>
        {children}
      </div>
    </div>
  );
}
