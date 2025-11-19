import Link from 'next/link';

import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

type SidebarSectionProps = {
  className?: string;
  navItems: NavItem[];
  title: string;
};

export function SidebarSection({ className, navItems, title }: SidebarSectionProps) {
  const hasNavItems = navItems.length > 0;

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
        {title}
      </h3>

      {hasNavItems && (
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
