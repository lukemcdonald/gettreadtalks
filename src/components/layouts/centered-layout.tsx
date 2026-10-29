import type { ComponentProps, ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

type MaxWidth = 'prose' | 'wide' | 'narrow' | 'full';
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CenteredLayoutProps {
  className?: string;
  content: ReactNode;
  header?: ReactNode;
  maxWidth?: MaxWidth;
  render?: ComponentProps<typeof Section>['render'];
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
  render,
  spacing = 'xl',
}: CenteredLayoutProps) {
  return (
    <Section render={render} spacing={spacing}>
      <Container
        className={cn('mx-auto', maxWidthClasses[maxWidth], className)}
      >
        {!!header && <div className="mb-10">{header}</div>}
        <div className="space-y-6">{content}</div>
      </Container>
    </Section>
  );
}
