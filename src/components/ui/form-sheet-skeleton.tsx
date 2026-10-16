'use client';

import { Field } from '@/components/ui/primitives/field';
import { Skeleton } from '@/components/ui/primitives/skeleton';

import { FormSheetBody } from './form-sheet-body';
import { FormSheetShell } from './form-sheet-shell';

const FIELD_SKELETONS = [
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-16' },
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-20' },
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-24' },
  { inputClassName: 'h-24 w-full rounded-lg', labelClassName: 'h-4 w-14' },
] as const;

export function FormSheetSkeleton() {
  return (
    <FormSheetShell
      onOpenChange={() => {}}
      open
      title={
        <>
          <span className="sr-only">Loading</span>
          <Skeleton aria-hidden className="h-5 w-40" />
        </>
      }
    >
      <FormSheetBody
        footer={
          <>
            <Skeleton className="h-9 w-20 rounded-lg sm:h-8" />
            <Skeleton className="h-9 w-24 rounded-lg sm:h-8" />
          </>
        }
      >
        <div className="space-y-4">
          {FIELD_SKELETONS.map(({ inputClassName, labelClassName }) => (
            <Field key={labelClassName}>
              <Skeleton className={labelClassName} />
              <Skeleton className={inputClassName} />
            </Field>
          ))}
        </div>
      </FormSheetBody>
    </FormSheetShell>
  );
}
