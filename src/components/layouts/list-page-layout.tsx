import { Container } from '@/components/container';
import { Section } from '@/components/section';

type ListPageLayoutProps = {
  children: React.ReactNode;
};

export function ListPageLayout({ children }: ListPageLayoutProps) {
  return (
    <Section variant="xl">
      <Container>
        <div className="space-y-12">{children}</div>
      </Container>
    </Section>
  );
}
