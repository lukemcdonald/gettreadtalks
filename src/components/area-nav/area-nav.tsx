'use client';

import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';

import {
  BookOpenIcon,
  CheckCircle2Icon,
  FilmIcon,
  FolderIcon,
  HeartIcon,
  MicIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/utils';

export const AREA_NAV_ICONS = {
  clips: FilmIcon,
  collections: FolderIcon,
  favorites: HeartIcon,
  finished: CheckCircle2Icon,
  settings: SettingsIcon,
  speakers: UsersIcon,
  studies: BookOpenIcon,
  talks: MicIcon,
  topics: TagIcon,
} as const satisfies Record<string, LucideIcon>;

export type AreaNavIcon = keyof typeof AREA_NAV_ICONS;

export interface AreaNavItem {
  href: Route;
  icon: AreaNavIcon;
  label: string;
}

export interface AreaNavSection {
  href: Route;
  items: AreaNavItem[];
  label: string;
}

interface AreaNavProps {
  items: AreaNavItem[];
  label: string;
  variant: 'sidebar' | 'tabs';
}

function AreaNavGlyph({ name }: { name: AreaNavIcon }) {
  const Icon = AREA_NAV_ICONS[name];

  return (
    <Icon
      aria-hidden="true"
      className="text-muted-foreground size-4 shrink-0"
    />
  );
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
        <ul className="-mx-3 flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.href === pathname;

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium outline-none',
                    'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                  href={item.href}
                >
                  <AreaNavGlyph name={item.icon} />
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
      <ul className="border-input flex w-full min-w-max gap-1 border-b">
        {items.map((item) => {
          const isActive = item.href === pathname;

          return (
            <li className="shrink-0" key={item.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
                  isActive
                    ? 'text-foreground after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                href={item.href}
                ref={isActive ? activeRef : undefined}
              >
                <AreaNavGlyph name={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
