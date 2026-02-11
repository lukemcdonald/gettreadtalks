'use client';

import type { ReactNode } from 'react';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxValue,
  Label,
} from '@/components/ui';
import { FilterPopup } from '@/components/ui/filter-popup';
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
  startAddon?: ReactNode;
}

/**
 * Multi-select filter with chip-based input.
 * Shows individual chips for all selected items - ideal for sidebars.
 * Uses shared FilterPopup with search at top (industry standard UX).
 */
export function ComboboxMultiFilter({
  className,
  label,
  name,
  options,
  placeholder = 'Select...',
  startAddon,
}: ComboboxMultiFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchParamValue = searchParams.get(name);
  const selectedValues = searchParamValue
    ? searchParamValue.split(',').filter((v) => options.some((opt) => opt.value === v))
    : [];

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
        autoHighlight
        disabled={isPending}
        items={options}
        multiple
        onValueChange={handleChange}
        value={selectedOptions}
      >
        <ComboboxChips startAddon={startAddon}>
          <ComboboxValue>
            {(value: FilterOption[]) => (
              <>
                {value.map((item) => (
                  <ComboboxChip aria-label={item.label} key={item.value}>
                    {item.label}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  aria-label={label ?? name}
                  placeholder={value.length > 0 ? undefined : placeholder}
                  size="lg"
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <FilterPopup label={label} name={name} />
      </Combobox>
    </div>
  );
}
