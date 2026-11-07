'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/utils';

import { Drawer, DrawerPanel, DrawerPopup } from './primitives/drawer';

const BOTTOM_DRAWER_HEIGHT_CLASS = {
  half: 'data-[swipe-direction=down]:[--drawer-height:var(--drawer-min-height)]',
  tall: 'data-[swipe-direction=down]:[--drawer-height:var(--drawer-max-height)]',
} as const;

type BottomDrawerHeight = keyof typeof BOTTOM_DRAWER_HEIGHT_CLASS;

type BottomDrawerPopupProps = ComponentProps<typeof DrawerPopup> & {
  height?: BottomDrawerHeight;
};

export function BottomDrawer(
  delegated: Omit<ComponentProps<typeof Drawer>, 'position'>
) {
  return <Drawer {...delegated} position="bottom" />;
}

/** Content-sized from half to tall. Pass `height` for a fixed scrolling sheet. */
export function BottomDrawerPopup({
  className,
  height,
  showBar = true,
  ...delegated
}: BottomDrawerPopupProps) {
  return (
    <DrawerPopup
      className={cn(
        'data-[swipe-direction=down]:before:bg-muted/72 data-[swipe-direction=down]:max-h-(--drawer-max-height) data-[swipe-direction=down]:min-h-(--drawer-min-height) data-[swipe-direction=down]:[--bleed:var(--drawer-min-height)] data-[swipe-direction=down]:[--drawer-max-height:90dvh] data-[swipe-direction=down]:[--drawer-min-height:50dvh]',
        height && BOTTOM_DRAWER_HEIGHT_CLASS[height],
        className
      )}
      showBar={showBar}
      {...delegated}
    />
  );
}

/** Fills remaining sheet height. Scrolls by default; pass `scrollable={false}` when children own overflow. */
export function BottomDrawerPanel({
  className,
  scrollable = true,
  ...delegated
}: ComponentProps<typeof DrawerPanel>) {
  return (
    <div className="flex min-h-0 flex-auto flex-col">
      <DrawerPanel
        className={cn(!scrollable && 'flex min-h-0 flex-1 flex-col', className)}
        scrollable={scrollable}
        {...delegated}
      />
    </div>
  );
}
