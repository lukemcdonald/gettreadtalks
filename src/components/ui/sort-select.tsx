'use client';

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

interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  className?: string;
  label: string;
  options: SortOption[];
  paramName?: string;
}

export function SortSelect({
  className,
  label,
  options,
  paramName = 'sort',
}: SortSelectProps) {
  const { current, isPending, updateUnlessDefault } = useFilterParam(paramName);
  const defaultSort = firstSortValue(options);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={paramName}>{label}</Label>
      <Select
        disabled={isPending}
        items={options}
        onValueChange={(newValue) => {
          updateUnlessDefault(newValue, defaultSort);
        }}
        value={current ?? defaultSort}
      >
        <SelectTrigger id={paramName} size="lg">
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

function firstSortValue(options: SortOption[]) {
  return options[0]?.value ?? '';
}
