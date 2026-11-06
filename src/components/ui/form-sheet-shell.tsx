'use client';

import type { ReactNode } from 'react';

import { BottomDrawerPopup } from '@/components/ui/bottom-drawer';
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/primitives/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FormSheetShellProps {
  children: ReactNode;
  header?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  testId?: string;
  title: ReactNode;
}

export function FormSheetShell({
  children,
  header,
  onOpenChange,
  open,
  testId,
  title,
}: FormSheetShellProps) {
  const isDesktop = useMediaQuery('lg');

  return (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      position={isDesktop ? 'right' : 'bottom'}
    >
      <BottomDrawerPopup
        className="has-data-[slot=drawer-bar]:ps-0 has-data-[slot=drawer-bar]:pt-0"
        data-testid={testId}
        showBar={!isDesktop}
        showCloseButton
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {header}
        </DrawerHeader>
        {children}
      </BottomDrawerPopup>
    </Drawer>
  );
}
