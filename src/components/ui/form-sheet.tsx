'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

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
  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="right">
      <DrawerPopup showBar showCloseButton>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <form
          className="grid min-h-0 flex-1 grid-rows-[1fr_auto]"
          onSubmit={onSubmit}
        >
          <DrawerPanel>
            <FormError error={error} />
            {children}
          </DrawerPanel>

          <DrawerFooter>
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
