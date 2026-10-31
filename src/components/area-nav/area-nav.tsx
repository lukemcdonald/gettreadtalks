'use client';

import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';
import type { RefObject } from 'react';

import {
  CheckCircle2Icon,
  FilmIcon,
  FolderIcon,
  HeartIcon,
  MicIcon,
  ScrollTextIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/utils';

import { isAreaNavItemActive } from './active';

export const AREA_NAV_ICONS = {
  clips: FilmIcon,
  collections: FolderIcon,
  favorites: HeartIcon,
  finished: CheckCircle2Icon,
  settings: SettingsIcon,
  speakers: UsersIcon,
  talks: MicIcon,
  topics: TagIcon,
  transcripts: ScrollTextIcon,
} as const satisfies Record<string, LucideIcon>;

export type AreaNavIcon = keyof typeof AREA_NAV_ICONS;

export interface AreaNavItem {
  children?: AreaNavItem[];
  href: Route;
  icon: AreaNavIcon;
  label: string;
}

export interface AreaNavSection {
  href: Route;
  items: AreaNavItem[];
  label: string;
}

type AreaNavVariant = 'sidebar' | 'tabs';

interface AreaNavProps {
  items: AreaNavItem[];
  label: string;
  variant: AreaNavVariant;
}

interface AreaNavLinkProps {
  href: Route;
  icon: AreaNavIcon;
  isActive: boolean;
  isCurrent: boolean;
  label: string;
  linkRef: RefObject<HTMLAnchorElement | null>;
  variant: AreaNavVariant;
}

interface AreaNavListProps {
  items: AreaNavItem[];
  linkRef: RefObject<HTMLAnchorElement | null>;
  nested?: boolean;
  pathname: string;
  variant: AreaNavVariant;
}

function buildAreaNavTestId(href: string) {
  return `nav-${href.slice(1).replaceAll('/', '-')}`;
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

function getAreaNavLinkClassName(isActive: boolean, variant: AreaNavVariant) {
  if (variant === 'sidebar') {
    return cn(
      'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium outline-none',
      'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1',
      isActive
        ? 'bg-muted text-foreground'
        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
    );
  }

  return cn(
    'relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
    isActive
      ? 'text-foreground after:bg-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5'
      : 'text-muted-foreground hover:text-foreground'
  );
}

function getAreaNavListClassName(nested: boolean, variant: AreaNavVariant) {
  if (nested && variant === 'sidebar') {
    return 'border-input mt-1 ms-5 flex flex-col gap-1 border-s ps-1';
  }

  if (nested) {
    return 'border-input ms-1 flex border-s ps-1';
  }

  if (variant === 'sidebar') {
    return '-mx-3 flex flex-col gap-1';
  }

  return 'border-input flex w-full min-w-max gap-1 border-b';
}

function AreaNavLink({
  href,
  icon,
  isActive,
  isCurrent,
  label,
  linkRef,
  variant,
}: AreaNavLinkProps) {
  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={getAreaNavLinkClassName(isActive, variant)}
      data-testid={buildAreaNavTestId(href)}
      href={href}
      ref={isCurrent ? linkRef : undefined}
    >
      <AreaNavGlyph name={icon} />
      {label}
    </Link>
  );
}

function AreaNavList({
  items,
  linkRef,
  nested = false,
  pathname,
  variant,
}: AreaNavListProps) {
  return (
    <ul className={getAreaNavListClassName(nested, variant)}>
      {items.map((item) => {
        const isCurrent = item.href === pathname;

        return (
          <li
            className={cn(
              variant === 'sidebar'
                ? 'flex flex-col'
                : 'flex shrink-0 items-end'
            )}
            key={item.href}
          >
            <AreaNavLink
              href={item.href}
              icon={item.icon}
              isActive={isAreaNavItemActive(item, pathname)}
              isCurrent={isCurrent}
              label={item.label}
              linkRef={linkRef}
              variant={variant}
            />
            {item.children?.length ? (
              <AreaNavList
                items={item.children}
                linkRef={linkRef}
                nested
                pathname={pathname}
                variant={variant}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function AreaNav({ items, label, variant }: AreaNavProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (variant !== 'tabs') {
      return;
    }

    let hasCurrentItem = false;

    for (const item of items) {
      if (isAreaNavItemActive(item, pathname)) {
        hasCurrentItem = true;
        break;
      }
    }

    if (!hasCurrentItem) {
      return;
    }

    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [items, pathname, variant]);

  return (
    <nav
      aria-label={label}
      className={variant === 'tabs' ? 'overflow-x-auto' : 'flex flex-col'}
    >
      <AreaNavList
        items={items}
        linkRef={activeRef}
        pathname={pathname}
        variant={variant}
      />
    </nav>
  );
}
