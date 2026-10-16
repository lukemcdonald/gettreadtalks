'use client';

import { FormSheet } from './form-sheet';
import { Field } from './primitives/field';
import { Skeleton } from './primitives/skeleton';

const FIELD_SKELETONS = [
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-16' },
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-20' },
  { inputClassName: 'h-8.5 w-full rounded-lg', labelClassName: 'h-4 w-24' },
  { inputClassName: 'h-24 w-full rounded-lg', labelClassName: 'h-4 w-14' },
] as const;

export function FormSheetSkeleton() {
  return (
    <FormSheet loading>
      <div className="space-y-4">
        {FIELD_SKELETONS.map(({ inputClassName, labelClassName }) => (
          <Field key={labelClassName}>
            <Skeleton className={labelClassName} />
            <Skeleton className={inputClassName} />
          </Field>
        ))}
      </div>
    </FormSheet>
  );
}
