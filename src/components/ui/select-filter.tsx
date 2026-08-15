'use client';

import { FILTER_ALL } from '@/constants/ui';
import { useFilterParam } from '@/hooks';
import { cn } from '@/utils';

import { Label } from './primitives/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from './primitives/select';

interface FilterOption {
  label: string;
  value: string | null;
}

interface SelectFilterProps {
  className?: string;
  defaultValue?: string;
  label: string;
  name: string;
  options: FilterOption[];
  placeholder?: string;
}

export function SelectFilter({
  className,
  defaultValue,
  label,
  name,
  options,
  placeholder,
}: SelectFilterProps) {
  const { current, isPending, updateUnlessDefault } = useFilterParam(name);
  const filterOptions = getFilterOptions(options, placeholder);
  const value = resolveSelectFilterValue(
    current,
    defaultValue,
    filterOptions,
    placeholder
  );

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>{label}</Label>
      <Select
        disabled={isPending}
        items={filterOptions}
        name={name}
        onValueChange={(newValue) => {
          updateUnlessDefault(newValue, FILTER_ALL);
        }}
        value={value}
      >
        <SelectTrigger id={name} size="lg">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}

function getFilterOptions(options: FilterOption[], placeholder?: string) {
  if (!placeholder) {
    return options;
  }

  return [{ label: placeholder, value: FILTER_ALL }, ...options];
}

function resolveSelectFilterValue(
  current: string | null,
  defaultValue: string | undefined,
  filterOptions: FilterOption[],
  placeholder: string | undefined
) {
  if (matchesFilterOption(current, filterOptions)) {
    return current;
  }

  if (placeholder) {
    return FILTER_ALL;
  }

  return defaultValue ?? null;
}

function matchesFilterOption(
  current: string | null,
  filterOptions: FilterOption[]
) {
  if (!current) {
    return false;
  }

  return filterOptions.some((option) => option.value === current);
}
