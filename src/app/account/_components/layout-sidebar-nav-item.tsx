'use client';

import type { ComponentType, SVGProps } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils';

interface LayoutSidebarNavItemProps {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function LayoutSidebarNavItem({ href, icon: Icon, label }: LayoutSidebarNavItemProps) {
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
