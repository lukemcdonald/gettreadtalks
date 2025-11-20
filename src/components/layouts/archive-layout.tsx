import { Container } from '@/components/container';
import { Section } from '@/components/section';

type ArchiveLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar: React.ReactNode;
};

export function ArchiveLayout({ children, header, sidebar }: ArchiveLayoutProps) {
  return (
    <Section variant="xl">
      <Container>
        {header && <div className="mb-8">{header}</div>}

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </Container>
    </Section>
  );
}
