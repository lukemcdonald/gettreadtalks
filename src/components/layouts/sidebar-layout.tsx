import type { ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

type SidebarLayoutProps = {
  content: ReactNode;
  header?: ReactNode;
  sidebar: ReactNode;
  className?: string;
  sidebarSticky?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export function SidebarLayout({
  content,
  header,
  sidebar,
  className,
  sidebarSticky = false,
  spacing = 'xl',
}: SidebarLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container className={className}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {header && <div className="col-span-full mb-10">{header}</div>}

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
