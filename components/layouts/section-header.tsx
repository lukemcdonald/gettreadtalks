import type { Route } from 'next';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SectionAction = {
  href: string;
  label: string;
};

type SectionHeaderProps = {
  actions?: SectionAction[];
  className?: string;
  description?: string;
  title: string;
};

export function SectionHeader({ actions, className, description, title }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-3xl lg:text-4xl">{title}</h2>
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action) => (
              <Button
                key={action.href}
                render={<Link href={action.href as Route} />}
                size="sm"
                variant="outline"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {description && <p className="text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
