import { Container } from '@/components/container';
import { cn } from '@/utils';

type SidebarLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  main: React.ReactNode;
  sidebar: React.ReactNode;
};

export function SidebarLayout({ children, className, main, sidebar }: SidebarLayoutProps) {
  return (
    <Container className={cn('py-12', className)}>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-6">{sidebar}</div>
        </aside>
        <main className="min-w-0 space-y-6">{main}</main>
      </div>

      {children}
    </Container>
  );
}
