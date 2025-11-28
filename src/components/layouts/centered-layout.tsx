import type { ReactNode } from 'react';

import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { cn } from '@/utils';

type MaxWidth = 'prose' | 'wide' | 'narrow' | 'full';
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type CenteredLayoutProps = {
  content: ReactNode;
  header?: ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
  spacing?: Spacing;
};

const maxWidthClasses: Record<MaxWidth, string> = {
  prose: 'max-w-prose',
  wide: 'max-w-4xl',
  narrow: 'max-w-md',
  full: 'max-w-full',
};

export function CenteredLayout({
  content,
  header,
  className,
  maxWidth = 'prose',
  spacing = 'xl',
}: CenteredLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container>
        <div className={cn('mx-auto', maxWidthClasses[maxWidth], className)}>
          {header && <div className="mb-10">{header}</div>}
          <div className="space-y-6">{content}</div>
        </div>
      </Container>
    </Section>
  );
}
