'use client';

import type { ComponentType, SVGProps } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils';

type SidebarNavItemProps = {
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

export function SidebarNavItem({ href, label, icon: Icon }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      className={cn(
        'flex items-center gap-2 font-medium hover:text-foreground',
        isActive ? 'text-foreground' : 'text-muted-foreground',
      )}
      href={href}
      key={href}
    >
      {!!Icon && <Icon className="size-4" />}
      {label}
    </Link>
  );
}
