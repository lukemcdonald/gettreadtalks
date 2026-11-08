'use client';

import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';
import type { RefObject } from 'react';

import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
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
import { useEffect, useRef, useState } from 'react';

import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui';
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
  studies: BookOpenIcon,
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
  isCurrent: boolean;
  label: string;
  linkRef: RefObject<HTMLElement | null>;
  variant: AreaNavVariant;
}

interface AreaNavListProps {
  items: AreaNavItem[];
  linkRef: RefObject<HTMLElement | null>;
  pathname: string;
  variant: AreaNavVariant;
}

interface AreaNavMenuProps {
  item: AreaNavItem;
  linkRef: RefObject<HTMLElement | null>;
  pathname: string;
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

function getAreaNavListClassName(variant: AreaNavVariant) {
  if (variant === 'sidebar') {
    return '-mx-3 flex flex-col gap-1';
  }

  return 'border-input flex w-full min-w-max gap-1 border-b';
}

function getAreaNavGroupItems(item: AreaNavItem) {
  return [item, ...(item.children ?? [])];
}

function flattenAreaNavItems(items: AreaNavItem[]) {
  return items.flatMap((item) => {
    if (!item.children?.length) {
      return [item];
    }

    return [item, ...item.children];
  });
}

function getAreaNavGroupCurrentItem(item: AreaNavItem, pathname: string) {
  return (
    getAreaNavGroupItems(item).find((entry) => entry.href === pathname) ?? item
  );
}

function bindActiveRef(
  isCurrent: boolean,
  linkRef: RefObject<HTMLElement | null>
) {
  return (node: HTMLElement | null) => {
    if (isCurrent) {
      linkRef.current = node;
    }
  };
}

function AreaNavLink({
  href,
  icon,
  isCurrent,
  label,
  linkRef,
  variant,
}: AreaNavLinkProps) {
  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={getAreaNavLinkClassName(isCurrent, variant)}
      data-testid={buildAreaNavTestId(href)}
      href={href}
      ref={bindActiveRef(isCurrent, linkRef)}
    >
      <AreaNavGlyph name={icon} />
      {label}
    </Link>
  );
}

function AreaNavMenu({ item, linkRef, pathname }: AreaNavMenuProps) {
  const current = getAreaNavGroupCurrentItem(item, pathname);
  const isActive = isAreaNavItemActive(item, pathname);

  return (
    <Menu>
      <MenuTrigger
        className={cn(
          'cursor-pointer border-0 bg-transparent',
          getAreaNavLinkClassName(isActive, 'tabs')
        )}
        data-testid={`${buildAreaNavTestId(item.href)}-menu`}
        ref={bindActiveRef(isActive, linkRef)}
        type="button"
      >
        <AreaNavGlyph name={current.icon} />
        {current.label}
        <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0" />
      </MenuTrigger>
      <MenuPopup align="start">
        {getAreaNavGroupItems(item).map((entry) => {
          const isCurrent = entry.href === pathname;

          return (
            <MenuItem
              key={entry.href}
              nativeButton={false}
              render={
                <Link
                  aria-current={isCurrent ? 'page' : undefined}
                  data-testid={buildAreaNavTestId(entry.href)}
                  href={entry.href}
                />
              }
            >
              <AreaNavGlyph name={entry.icon} />
              {entry.label}
            </MenuItem>
          );
        })}
      </MenuPopup>
    </Menu>
  );
}

function AreaNavList({ items, linkRef, pathname, variant }: AreaNavListProps) {
  const visibleItems =
    variant === 'sidebar' ? flattenAreaNavItems(items) : items;

  return (
    <ul className={getAreaNavListClassName(variant)}>
      {visibleItems.map((item) => (
        <li
          className={
            variant === 'sidebar' ? 'flex flex-col' : 'flex shrink-0 items-end'
          }
          key={item.href}
        >
          {variant === 'tabs' && item.children?.length ? (
            <AreaNavMenu item={item} linkRef={linkRef} pathname={pathname} />
          ) : (
            <AreaNavLink
              href={item.href}
              icon={item.icon}
              isCurrent={item.href === pathname}
              label={item.label}
              linkRef={linkRef}
              variant={variant}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function AreaNav({ items, label, variant }: AreaNavProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const [showEndFade, setShowEndFade] = useState(false);
  const [showStartFade, setShowStartFade] = useState(false);

  useEffect(() => {
    if (variant !== 'tabs') {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const element = scroller;

    function updateEdges() {
      const maxScroll = element.scrollWidth - element.clientWidth;

      setShowStartFade(element.scrollLeft > 1);
      setShowEndFade(maxScroll > 1 && element.scrollLeft < maxScroll - 1);
    }

    if (items.some((item) => isAreaNavItemActive(item, pathname))) {
      activeRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }

    updateEdges();
    element.addEventListener('scroll', updateEdges, { passive: true });
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateEdges);
    observer?.observe(element);

    return () => {
      element.removeEventListener('scroll', updateEdges);
      observer?.disconnect();
    };
  }, [items, pathname, variant]);

  const nav = (
    <nav
      aria-label={label}
      className={variant === 'tabs' ? 'overflow-x-auto' : 'flex flex-col'}
      ref={scrollerRef}
    >
      <AreaNavList
        items={items}
        linkRef={activeRef}
        pathname={pathname}
        variant={variant}
      />
    </nav>
  );

  if (variant !== 'tabs') {
    return nav;
  }

  return (
    <div className="relative">
      {showStartFade ? (
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-linear-to-r to-transparent"
        />
      ) : null}
      {nav}
      {showEndFade ? (
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-linear-to-l to-transparent"
        />
      ) : null}
    </div>
  );
}
