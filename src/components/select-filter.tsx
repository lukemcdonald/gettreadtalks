'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { cn } from '@/utils';

const ALL_OPTION_VALUE = 'all';

type FilterOption = {
  label: string;
  value: string | null;
};

type SelectFilterProps = {
  className?: string;
  defaultValue?: string;
  label?: string;
  name?: string;
  options: FilterOption[];
  placeholder?: string;
};

export function SelectFilter({
  className,
  defaultValue,
  label,
  name,
  options,
  placeholder,
}: SelectFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (!name) {
    throw new Error('SelectFilter requires a name prop');
  }

  const searchParamValue = searchParams.get(name);

  // Only show "All" option if placeholder is provided
  const allOption = placeholder ? { label: placeholder, value: ALL_OPTION_VALUE } : null;
  const allOptions = allOption ? [allOption, ...options] : options;

  function getInitialValue(): string | null {
    if (searchParamValue && allOptions.some((opt) => opt.value === searchParamValue)) {
      return searchParamValue;
    }

    if (allOption) {
      return ALL_OPTION_VALUE;
    }

    return defaultValue ?? null;
  }

  const initialValue = getInitialValue();

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

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={name}>{label}</Label>}

      <Select
        disabled={isPending}
        items={allOptions}
        name={name}
        onValueChange={handleChange}
        value={initialValue}
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {allOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}
