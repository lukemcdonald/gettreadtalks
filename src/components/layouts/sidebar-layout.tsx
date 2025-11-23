import { Container } from '@/components/container';
import { Main } from '@/components/main';
import { Section } from '@/components/section';

type SidebarLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar: React.ReactNode;
};

export function SidebarLayout({ children, header, sidebar }: SidebarLayoutProps) {
  return (
    <Section variant="xl">
      <Container>
        {header && <div className="mb-8">{header}</div>}

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <Main className="min-w-0 space-y-6">{children}</Main>
        </div>
      </Container>
    </Section>
  );
}
