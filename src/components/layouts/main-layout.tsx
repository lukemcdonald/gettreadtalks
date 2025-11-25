import { Container } from '@/components/container';
import { Main } from '@/components/main';
import { Section } from '@/components/section';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Section py="xl">
      <Container>
        <Main className="mx-auto max-w-prose">{children}</Main>
      </Container>
    </Section>
  );
}
