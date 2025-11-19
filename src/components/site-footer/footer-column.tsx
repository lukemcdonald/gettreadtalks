import { cn } from '@/utils';

type FooterColumnProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

export function FooterColumn({ children, className, title }: FooterColumnProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-foreground text-sm uppercase">{title}</h3>
      <nav aria-label={title} className="flex flex-col space-y-2">
        {children}
      </nav>
    </div>
  );
}
