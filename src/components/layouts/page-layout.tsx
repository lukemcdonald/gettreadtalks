import { Container } from '@/components/container';
import { cn } from '@/utils';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return <Container className={cn('w-full pt-6 pb-12', className)}>{children}</Container>;
}
