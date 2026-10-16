'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { FormError } from '@/components/ui/form/form-error';
import { Button } from '@/components/ui/primitives/button';

import { FormSheetBody } from './form-sheet-body';
import { FormSheetShell } from './form-sheet-shell';

export interface FormSheetProps {
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
    <FormSheetShell onOpenChange={onOpenChange} open={open} title={title}>
      <form className="contents" onSubmit={onSubmit}>
        <FormSheetBody
          footer={
            <>
              <Button
                disabled={isPending}
                onClick={() => {
                  onOpenChange(false);
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button loading={isPending} type="submit">
                {submitLabel}
              </Button>
            </>
          }
        >
          <FormError error={error} />
          {children}
        </FormSheetBody>
      </form>
    </FormSheetShell>
  );
}
