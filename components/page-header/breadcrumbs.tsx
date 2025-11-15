import Link from 'next/link';

import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  href: string;
  label: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={item.href}>
              {index > 0 && (
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
