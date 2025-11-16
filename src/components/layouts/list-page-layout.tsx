import { Container } from '@/components/container';
import { cn } from '@/lib/utils';

type ListPageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function ListPageLayout({ children, className }: ListPageLayoutProps) {
  return (
    <Container className={cn('py-12', className)}>
      <div className="space-y-12">{children}</div>
    </Container>
  );
}
