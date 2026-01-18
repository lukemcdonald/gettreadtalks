'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  Label,
} from '@/components/ui';
import { cn } from '@/utils';

const ALL_OPTION_VALUE = '__all__';

type FilterOption = {
  label: string;
  value: string;
};

type FilterMode = 'contains' | 'startsWith';

type ComboboxFilterProps = {
  className?: string;
  filterMode?: FilterMode;
  label?: string;
  name: string;
  options: FilterOption[];
  placeholder?: string;
};

export function ComboboxFilter({
  className,
  filterMode = 'contains',
  label,
  name,
  options,
  placeholder = 'All',
}: ComboboxFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchParamValue = searchParams.get(name);

  // Build options with "All" at the top
  const allOption: FilterOption = { label: placeholder, value: ALL_OPTION_VALUE };
  const allOptions = [allOption, ...options];

  function getInitialValue(): string {
    if (searchParamValue && options.some((opt) => opt.value === searchParamValue)) {
      return searchParamValue;
    }
    return ALL_OPTION_VALUE;
  }

  const currentValue = getInitialValue();

  const handleChange = (newValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue !== ALL_OPTION_VALUE) {
      params.set(name, newValue);
    } else {
      params.delete(name);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const filterOptions = (itemValue: string, query: string): boolean => {
    const option = allOptions.find((opt) => opt.value === itemValue);
    if (!option) {
      return false;
    }
    const label = option.label.toLowerCase();
    const search = query.toLowerCase();
    return filterMode === 'startsWith' ? label.startsWith(search) : label.includes(search);
  };

  const getItemLabel = (itemValue: string): string => {
    const option = allOptions.find((opt) => opt.value === itemValue);
    return option?.label ?? '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={name}>{label}</Label>}

      <Combobox
        disabled={isPending}
        filter={filterOptions}
        items={allOptions.map((opt) => opt.value)}
        itemToStringLabel={getItemLabel}
        onValueChange={handleChange}
        value={currentValue}
      >
        <ComboboxInput
          id={name}
          placeholder={`Search ${label?.toLowerCase() ?? 'options'}...`}
          showClear={currentValue !== ALL_OPTION_VALUE}
        />

        <ComboboxPopup>
          <ComboboxEmpty>No matches found</ComboboxEmpty>
          <ComboboxList>
            {(itemValue: string) => {
              const option = allOptions.find((opt) => opt.value === itemValue);
              if (!option) {
                return null;
              }

              return (
                <ComboboxItem key={option.value} value={option.value}>
                  {option.label}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </div>
  );
}
