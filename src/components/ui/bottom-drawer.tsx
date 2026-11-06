'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/utils';

import { Drawer, DrawerPopup } from './primitives/drawer';

const BOTTOM_DRAWER_HEIGHT_CLASS = {
  half: 'data-[swipe-direction=down]:[--drawer-height:50dvh]',
  tall: 'data-[swipe-direction=down]:[--drawer-height:90dvh]',
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

/** Locked half-viewport height on bottom sheets. Pass `tall` for search. */
export function BottomDrawerPopup({
  className,
  height = 'half',
  showBar = true,
  ...delegated
}: BottomDrawerPopupProps) {
  return (
    <DrawerPopup
      className={cn(BOTTOM_DRAWER_HEIGHT_CLASS[height], className)}
      showBar={showBar}
      {...delegated}
    />
  );
}
