'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/utils';

import { Drawer, DrawerPopup } from './primitives/drawer';

const BOTTOM_DRAWER_HEIGHT_CLASS = {
  half: '[--drawer-height:50dvh]',
  tall: '[--drawer-height:90dvh]',
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

/** Half-viewport floor on bottom sheets. `height` locks the sheet so nested popups cannot resize it. */
export function BottomDrawerPopup({
  className,
  height,
  showBar = true,
  ...delegated
}: BottomDrawerPopupProps) {
  return (
    <DrawerPopup
      className={cn(
        'data-[swipe-direction=down]:min-h-[50dvh]',
        height && BOTTOM_DRAWER_HEIGHT_CLASS[height],
        className
      )}
      showBar={showBar}
      {...delegated}
    />
  );
}
