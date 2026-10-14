'use client';

import type { SearchOverlayProps } from '@/features/search/types';

import { useRef } from 'react';

import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from '@/components/ui';

import { SearchCommand, SearchCommandField } from './search-command';
import { SearchCommandResults } from './search-command-results';

export function MobileSearchDrawer({
  groups,
  isLoading,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  status,
  value,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpenChangeComplete(isOpen: boolean) {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <Drawer
      defaultSnapPoint={0.9}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      open={open}
      position="bottom"
      snapPoints={[0.9]}
    >
      <DrawerPopup showBar variant="default">
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <DrawerHeader>
            <DrawerTitle className="sr-only">Search</DrawerTitle>
            <SearchCommandField
              inputClassName="has-focus-visible:border-input"
              isLoading={isLoading}
              ref={inputRef}
            />
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col">
            <DrawerPanel>
              <SearchCommandResults
                groups={groups}
                onSelect={onSelect}
                status={status}
              />
            </DrawerPanel>
          </div>
        </SearchCommand>
      </DrawerPopup>
    </Drawer>
  );
}
