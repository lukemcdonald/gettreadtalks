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

type SortOption = {
  label: string;
  value: string;
};

type SortSelectProps = {
  className?: string;
  label?: string;
  options: SortOption[];
  paramName?: string;
};

export function SortSelect({ className, label, options, paramName = 'sort' }: SortSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const value = searchParams.get(paramName) ?? options[0]?.value ?? '';

  const handleChange = (newValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue !== options[0]?.value) {
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

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={paramName}>{label}</Label>}
      <Select disabled={isPending} items={options} onValueChange={handleChange} value={value}>
        <SelectTrigger id={paramName}>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}
