import { Container } from '@/components/container';
import { Section } from '@/components/section';

type SidebarLayoutProps = {
  children?: React.ReactNode;
  main: React.ReactNode;
  sidebar: React.ReactNode;
};

export function SidebarLayout({ children, main, sidebar }: SidebarLayoutProps) {
  return (
    <Section variant="xl">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <main className="min-w-0 space-y-6">{main}</main>
        </div>

        {children}
      </Container>
    </Section>
  );
}
