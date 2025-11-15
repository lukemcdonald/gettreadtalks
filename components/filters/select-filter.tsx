'use client';

import { LoaderCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectPopup as SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SelectFilterOption = {
  label: string;
  value: string;
};

type SelectFilterProps = {
  className?: string;
  defaultValue?: string;
  label?: string;
  options: SelectFilterOption[];
  paramName?: string;
  placeholder?: string;
};

export function SelectFilter({
  className,
  defaultValue,
  label,
  options,
  paramName = 'filter',
  placeholder = 'All',
}: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useState<string | null>(null);

  const currentValue = searchParams.get(paramName) || defaultValue || 'all';
  const displayValue = optimisticValue || currentValue;

  // Reset optimistic value when URL params catch up
  useEffect(() => {
    if (optimisticValue && optimisticValue === currentValue) {
      setOptimisticValue(null);
    }
  }, [currentValue, optimisticValue]);

  const handleChange = useCallback(
    (value: string) => {
      // Optimistically update the displayed value immediately
      setOptimisticValue(value);

      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== 'all') {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [paramName, router, searchParams],
  );

  const selectedOption = options.find((option) => option.value === displayValue);
  const displayLabel = displayValue === 'all' ? placeholder : selectedOption?.label || displayValue;

  return (
    <div className={cn('min-w-[150px]', className)}>
      {label && <Label htmlFor={paramName}>{label}</Label>}
      <Select onValueChange={handleChange} value={displayValue}>
        <SelectTrigger
          className={cn(isPending && 'opacity-75')}
          id={paramName}
        >
          <SelectValue placeholder={placeholder}>
            <span className="flex items-center gap-2">
              {isPending && <LoaderCircleIcon className="size-3 animate-spin" />}
              {displayLabel}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
