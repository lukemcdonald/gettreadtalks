'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { useMediaQuery } from '@/hooks/use-media-query';

import { FormError } from './form/form-error';
import { Button } from './primitives/button';
import {
  Drawer,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from './primitives/drawer';

interface FormSheetProps {
  children: ReactNode;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  open: boolean;
  submitLabel: string;
  title: string;
}

export function FormSheet({
  children,
  error,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  submitLabel,
  title,
}: FormSheetProps) {
  const isDesktop = useMediaQuery('lg');

  return (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      position={isDesktop ? 'right' : 'bottom'}
    >
      <DrawerPopup
        className="has-data-[slot=drawer-bar]:ps-0 has-data-[slot=drawer-bar]:pt-0"
        showBar
        showCloseButton
        variant="default"
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <form className="contents" onSubmit={onSubmit}>
          <div className="flex min-h-0 flex-1 flex-col">
            <DrawerPanel>
              <FormError error={error} />
              {children}
            </DrawerPanel>
          </div>

          <DrawerFooter className="overflow-hidden">
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button loading={isPending} type="submit">
              {submitLabel}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerPopup>
    </Drawer>
  );
}
