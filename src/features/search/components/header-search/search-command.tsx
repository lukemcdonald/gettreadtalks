import type { SearchOverlayProps } from '@/features/search/types';
import type { ReactNode, Ref } from 'react';

import { SearchIcon } from 'lucide-react';

import { AutocompleteInput, Command, Spinner } from '@/components/ui';
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
      {children}
    </Command>
  );
}

export function SearchCommandField({
  autoFocus = false,
  className,
  inputClassName,
  isLoading,
  ref,
}: {
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  isLoading: boolean;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <div className={cn('relative', className)}>
      <AutocompleteInput
        aria-label="Search talks, speakers, topics, and clips"
        autoFocus={autoFocus}
        className={cn(
          'has-focus-visible:ring-0',
          inputClassName,
          isLoading && '*:data-[slot=autocomplete-input]:pe-9'
        )}
        placeholder="Search talks, speakers, topics, and clips"
        ref={ref}
        size="lg"
        startAddon={<SearchIcon />}
      />
      {isLoading ? (
        <Spinner className="text-muted-foreground pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2" />
      ) : null}
    </div>
  );
}
