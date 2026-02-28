import type { ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

interface SidebarsLayoutProps {
  className?: string;
  content: ReactNode;
  header?: ReactNode;
  leftSidebar: ReactNode;
  leftSidebarSticky?: boolean;
  rightSidebar?: ReactNode;
  rightSidebarSticky?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function SidebarsLayout({
  className,
  content,
  header,
  leftSidebar,
  leftSidebarSticky,
  rightSidebar,
  rightSidebarSticky,
  spacing = 'xl',
}: SidebarsLayoutProps) {
  return (
    <Section spacing={spacing}>
      <Container className={className}>
        {!!header && <div className="mb-10">{header}</div>}

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12">
          <div
            className={cn(
              'space-y-6 md:col-span-3',
              leftSidebarSticky && 'md:sticky md:top-20 md:h-fit',
            )}
          >
            {leftSidebar}
          </div>

          <div className="min-w-0 space-y-6 md:col-span-9 lg:col-span-6">{content}</div>

          {!!rightSidebar && (
            <div
              className={cn(
                'space-y-6 md:col-span-full lg:col-span-3',
                rightSidebarSticky && 'md:sticky md:top-20 md:h-fit',
              )}
            >
              {rightSidebar}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
