'use client';

import type React from 'react';

import { Fieldset as FieldsetPrimitiveRoot } from '@/components/ui/primitives/fieldset';
import { cn } from '@/utils';

type FieldsetProps = React.ComponentProps<typeof FieldsetPrimitiveRoot>;

export function Fieldset({
  className,
  ...props
}: FieldsetProps): React.ReactElement {
  return (
    <FieldsetPrimitiveRoot
      className={cn('flex w-full flex-col gap-6', className)}
      {...props}
    />
  );
}

export {
  FieldsetLegend,
  FieldsetPrimitive,
} from '@/components/ui/primitives/fieldset';
