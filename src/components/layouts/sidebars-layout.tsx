import type { ReactNode } from 'react';

import { Container, Section } from '@/components/ui';
import { cn } from '@/utils';

type SidebarsLayoutProps = {
  content: ReactNode;
  header?: ReactNode;
  leftSidebar: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
  leftSidebarSticky?: boolean;
  rightSidebarSticky?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

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
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-12">
          {!!header && <div className="col-span-full mb-10">{header}</div>}

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
