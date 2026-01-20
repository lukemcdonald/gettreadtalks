'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
  Label,
} from '@/components/ui';
import { cn } from '@/utils';

interface FilterOption {
  label: string;
  value: string;
}

interface ComboboxMultiFilterProps {
  className?: string;
  label?: string;
  name: string;
  options: FilterOption[];
  placeholder?: string;
}

export function ComboboxMultiFilter({
  className,
  label,
  name,
  options,
  placeholder = 'Select...',
}: ComboboxMultiFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse comma-separated values from URL
  const searchParamValue = searchParams.get(name);
  const selectedValues = searchParamValue
    ? searchParamValue.split(',').filter((v) => options.some((opt) => opt.value === v))
    : [];

  // Convert selected values to option objects for the Combobox
  const selectedOptions = selectedValues
    .map((value) => options.find((opt) => opt.value === value))
    .filter((opt): opt is FilterOption => opt !== undefined);

  const handleChange = (newValue: FilterOption[] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue.length > 0) {
      params.set(name, newValue.map((opt) => opt.value).join(','));
    } else {
      params.delete(name);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={name}>{label}</Label>}

      <Combobox
        disabled={isPending}
        items={options}
        multiple
        onValueChange={handleChange}
        value={selectedOptions}
      >
        <ComboboxChips>
          <ComboboxValue>
            {(value: FilterOption[]) => (
              <>
                {value.map((item) => (
                  <ComboboxChip aria-label={item.label} key={item.value}>
                    {item.label}
                  </ComboboxChip>
                ))}
                <ComboboxInput
                  aria-label={label ?? name}
                  id={name}
                  placeholder={value.length > 0 ? undefined : placeholder}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxPopup>
          <ComboboxEmpty>No matches found</ComboboxEmpty>
          <ComboboxList>
            {(item: FilterOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </div>
  );
}
