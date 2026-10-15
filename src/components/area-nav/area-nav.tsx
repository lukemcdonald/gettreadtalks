'use client';

import type { Route } from 'next';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/utils';

export interface AreaNavItem {
  href: Route;
  label: string;
}

interface AreaNavProps {
  items: AreaNavItem[];
  label: string;
  variant: 'sidebar' | 'tabs';
}

export function AreaNav({ items, label, variant }: AreaNavProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (variant !== 'tabs') {
      return;
    }

    const activeItem = items.find((item) => item.href === pathname);

    if (!activeItem) {
      return;
    }

    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [items, pathname, variant]);

  if (variant === 'sidebar') {
    return (
      <nav aria-label={label} className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = item.href === pathname;

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'hover:text-foreground flex items-center gap-2 font-medium',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label={label} className="overflow-x-auto">
      <ul className="flex w-full min-w-max gap-1 border-b">
        {items.map((item) => {
          const isActive = item.href === pathname;

          return (
            <li className="shrink-0" key={item.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap',
                  isActive
                    ? 'text-foreground after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                href={item.href}
                ref={isActive ? activeRef : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
