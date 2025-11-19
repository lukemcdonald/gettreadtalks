import { Container } from '@/components/container';
import { cn } from '@/utils';

type ArchiveLayoutProps = {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  sidebar: React.ReactNode;
};

export function ArchiveLayout({ children, className, header, sidebar }: ArchiveLayoutProps) {
  return (
    <Container className={cn('py-12', className)}>
      {header && <div className="mb-8">{header}</div>}

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-6">{sidebar}</div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </Container>
  );
}
