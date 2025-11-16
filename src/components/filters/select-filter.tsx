'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FilterOption = {
  label: string;
  value: string;
};

type SelectFilterProps = {
  className?: string;
  label?: string;
  options: FilterOption[];
  paramName?: string;
  placeholder?: string;
};

export function SelectFilter({
  className,
  label,
  options,
  paramName,
  placeholder = 'All',
}: SelectFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (!paramName) {
    throw new Error('SelectFilter requires a paramName prop');
  }

  const value = searchParams.get(paramName) ?? '';

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue !== 'all') {
      params.set(paramName, newValue);
    } else {
      params.delete(paramName);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  // Add "All" option if not present
  const allOptions: FilterOption[] = options.some((opt) => opt.value === 'all')
    ? options
    : [{ label: placeholder, value: 'all' }, ...options];

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={paramName}>{label}</Label>}
      <Select disabled={isPending} onValueChange={handleChange} value={value || 'all'}>
        <SelectTrigger id={paramName}>
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
