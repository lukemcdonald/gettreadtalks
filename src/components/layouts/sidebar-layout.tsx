import type { ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

interface SidebarLayoutProps {
  className?: string;
  content: ReactNode;
  header?: ReactNode;
  sidebar: ReactNode;
  sidebarSticky?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function SidebarLayout({
  className,
  content,
  header,
  sidebar,
  sidebarSticky = false,
  spacing = 'xl',
}: SidebarLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container className={className}>
        {!!header && <div className="mb-10">{header}</div>}

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12">
          <div
            className={cn(
              'space-y-6 md:col-span-3',
              sidebarSticky && 'md:sticky md:top-20 md:h-fit',
            )}
          >
            {sidebar}
          </div>

          <div className="min-w-0 space-y-6 md:col-span-9">{content}</div>
        </div>
      </Container>
    </Section>
  );
}
