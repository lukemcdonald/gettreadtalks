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
      <nav aria-label={label} className="flex flex-col">
        <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          {label}
        </h2>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.href === pathname;

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-sm font-medium outline-none',
                    'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                  href={item.href}
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
