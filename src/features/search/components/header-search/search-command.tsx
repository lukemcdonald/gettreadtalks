import type { SearchOverlayProps } from '@/features/search/types';
import type { ReactNode, Ref } from 'react';

import { Command, CommandInput, Spinner } from '@/components/ui';
import { cn } from '@/utils';

export function SearchCommand({
  children,
  groups,
  onInputValueChange,
  value,
}: {
  children: ReactNode;
  groups: SearchOverlayProps['groups'];
  onInputValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <Command
      items={groups}
      mode="none"
      onValueChange={(nextValue, eventDetails) => {
        if (eventDetails.reason === 'item-press') {
          return;
        }

        onInputValueChange(nextValue);
      }}
      value={value}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </Command>
  );
}

export function SearchCommandField({
  autoFocus = false,
  className,
  isLoading,
  ref,
}: {
  autoFocus?: boolean;
  className?: string;
  isLoading: boolean;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <label className={cn('relative', className)}>
      <CommandInput
        aria-label="Search talks, speakers, topics, and clips"
        autoFocus={autoFocus}
        className={cn(isLoading && '*:data-[slot=autocomplete-input]:pe-9')}
        placeholder="Search talks, speakers, topics, and clips"
        ref={ref}
      />
      {isLoading ? (
        <Spinner className="text-muted-foreground pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2" />
      ) : null}
    </label>
  );
}
