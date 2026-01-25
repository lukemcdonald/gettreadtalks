import type { ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

type MaxWidth = 'prose' | 'wide' | 'narrow' | 'full';
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CenteredLayoutProps {
  className?: string;
  content: ReactNode;
  header?: ReactNode;
  maxWidth?: MaxWidth;
  spacing?: Spacing;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  full: 'max-w-full',
  narrow: 'max-w-md',
  prose: 'max-w-prose',
  wide: 'max-w-4xl',
};

export function CenteredLayout({
  className,
  content,
  header,
  maxWidth = 'prose',
  spacing = 'xl',
}: CenteredLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container className={cn('mx-auto', maxWidthClasses[maxWidth], className)}>
        {!!header && <div className="mb-10">{header}</div>}
        <div className="space-y-6">{content}</div>
      </Container>
    </Section>
  );
}
