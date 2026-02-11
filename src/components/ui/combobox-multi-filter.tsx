'use client';

import type { ReactNode } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxValue,
  Label,
} from '@/components/ui';
import { FilterPopup } from '@/components/ui/filter-popup';
import { useFilterParam } from '@/hooks';
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
  const { current, isPending, update } = useFilterParam(name);

  const selectedOptions = (current ? current.split(',') : [])
    .map((value) => options.find((opt) => opt.value === value))
    .filter((opt): opt is FilterOption => opt !== undefined);

  const handleChange = (newValue: FilterOption[] | null) => {
    const joined =
      newValue && newValue.length > 0 ? newValue.map((opt) => opt.value).join(',') : null;
    update(joined);
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
