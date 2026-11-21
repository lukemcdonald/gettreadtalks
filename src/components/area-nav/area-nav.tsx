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
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
} as const satisfies Record<string, LucideIcon>;

export type AreaNavIcon = keyof typeof AREA_NAV_ICONS;

export interface AreaNavChild {
  href: Route;
  label: string;
}

export interface AreaNavItem {
  children?: AreaNavChild[];
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
  icon?: AreaNavIcon;
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
      className={cn(
        getAreaNavLinkClassName(isCurrent, variant),
        !icon && variant === 'sidebar' && 'pl-9'
      )}
      data-testid={buildAreaNavTestId(href)}
      href={href}
      ref={bindActiveRef(isCurrent, linkRef)}
    >
      {icon ? <AreaNavGlyph name={icon} /> : null}
      {label}
    </Link>
  );
}

function AreaNavList({ items, linkRef, pathname, variant }: AreaNavListProps) {
  const itemClassName =
    variant === 'sidebar' ? 'flex flex-col gap-1' : 'flex shrink-0 items-end';

  return (
    <ul className={getAreaNavListClassName(variant)}>
      {items.map((item) => (
        <li className={itemClassName} key={item.href}>
          <AreaNavLink
            href={item.href}
            icon={item.icon}
            isCurrent={item.href === pathname}
            label={item.label}
            linkRef={linkRef}
            variant={variant}
          />
          {item.children?.length ? (
            <ul
              className={
                variant === 'sidebar' ? 'flex flex-col gap-1' : 'flex gap-1'
              }
            >
              {item.children.map((child) => (
                <li className={itemClassName} key={child.href}>
                  <AreaNavLink
                    href={child.href}
                    isCurrent={child.href === pathname}
                    label={child.label}
                    linkRef={linkRef}
                    variant={variant}
                  />
                </li>
              ))}
            </ul>
          ) : null}
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
