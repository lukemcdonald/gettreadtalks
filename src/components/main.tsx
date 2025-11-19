import { cn } from '@/utils';

type MainProps = {
  children: React.ReactNode;
  className?: string;
};

export function Main({ children, className, ...delegated }: MainProps) {
  return (
    <main className={cn('flex-1', className)} id="main-content" {...delegated}>
      {children}
    </main>
  );
}
