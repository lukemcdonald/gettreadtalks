import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { cn } from '@/utils';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
};

type CenteredLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  maxWidth?: MaxWidth;
  rightSidebar?: React.ReactNode;
};

export function CenteredLayout({
  children,
  header,
  leftSidebar,
  maxWidth = 'lg',
  rightSidebar,
}: CenteredLayoutProps) {
  const hasSidebars = leftSidebar || rightSidebar;

  return (
    <Section py="xl">
      <Container>
        {header && (
          <div
            className={cn(
              'mb-8',
              hasSidebars && 'lg:grid lg:grid-cols-[250px_1fr_250px] lg:gap-8',
              !hasSidebars && 'mx-auto',
              !hasSidebars && maxWidthClasses[maxWidth],
            )}
          >
            {header}
          </div>
        )}

        {hasSidebars ? (
          <div className="grid gap-8 lg:grid-cols-[250px_1fr_250px]">
            {leftSidebar && (
              <aside className="lg:sticky lg:top-8 lg:h-fit">
                <div className="space-y-6">{leftSidebar}</div>
              </aside>
            )}

            <div className={cn('min-w-0', maxWidthClasses[maxWidth], 'mx-auto')}>{children}</div>

            {rightSidebar && (
              <aside className="lg:sticky lg:top-8 lg:h-fit">
                <div className="space-y-6">{rightSidebar}</div>
              </aside>
            )}
          </div>
        ) : (
          <main className={cn('mx-auto', maxWidthClasses[maxWidth])}>{children}</main>
        )}
      </Container>
    </Section>
  );
}
