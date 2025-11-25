import { Container } from '@/components/container';
import { Main } from '@/components/main';
import { Section } from '@/components/section';
import { cn } from '@/utils';

export function MainLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Main>
      <Section py="xl">
        <Container className={cn('mx-auto max-w-prose', className)}>{children}</Container>
      </Section>
    </Main>
  );
}
