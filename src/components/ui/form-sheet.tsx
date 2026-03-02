'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { FormError } from './form/form-error';
import { Button } from './primitives/button';
import {
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from './primitives/sheet';
import { SheetStack, useSheetLayer, useSheetStack } from './sheet-stack';

interface FormSheetProps {
  children: ReactNode;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  open: boolean;
  pendingLabel?: string;
  submitLabel: string;
  title: string;
}

export function FormSheet(props: FormSheetProps) {
  const stack = useSheetStack();

  if (stack) {
    return <FormSheetInner {...props} />;
  }

  return (
    <SheetStack>
      <FormSheetInner {...props} />
    </SheetStack>
  );
}

function FormSheetInner({
  children,
  error,
  isPending,
  onOpenChange,
  onSubmit,
  open,
  pendingLabel = 'Saving...',
  submitLabel,
  title,
}: FormSheetProps) {
  const layer = useSheetLayer(open, () => onOpenChange(false));

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup data-sheet-layer-id={layer.id} side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={onSubmit}>
          <SheetPanel>
            <FormError error={error} />
            {children}
          </SheetPanel>

          <SheetFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? pendingLabel : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
