import { cn } from '@/utils';

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionContainer({ children, className }: SectionContainerProps) {
  return <section className={cn('space-y-6', className)}>{children}</section>;
}
