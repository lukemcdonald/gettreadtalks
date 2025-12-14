'use client';

import { useState } from 'react';
import { LoaderCircleIcon, X as RemoveIcon } from 'lucide-react';

import {
  GroupItem,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { cn } from '@/utils';

type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  isPending?: boolean;
  onClear: () => void;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  pendingFilter?: string | null;
  selectedLabel: string;
  value: string | null;
};

export function FilterSelect({
  isPending,
  onClear,
  onValueChange,
  options,
  pendingFilter,
  selectedLabel,
  value,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    onClear();
  };

  const handleValueChange = (newValue: string | null) => {
    setIsOpen(false);

    if (newValue) {
      onValueChange(newValue);
    }
  };

  const displayValue = value ?? 'all';
  const isActive = !!value;
  const isLoading = isPending && pendingFilter;

  return (
    <Select
      onOpenChange={setIsOpen}
      onValueChange={handleValueChange}
      open={isOpen}
      value={displayValue}
    >
      <GroupItem
        render={
          <SelectTrigger
            className={cn(
              'w-fit min-w-0 gap-2 [&_[data-slot=select-icon]]:hidden',
              isActive && 'data-[pressed]:true',
            )}
            data-pressed={isActive ? true : undefined}
          />
        }
      >
        <SelectValue>
          <span className="flex min-w-0 items-center gap-2">
            {(() => {
              if (isLoading) {
                return (
                  <span className="flex size-6 shrink-0 items-center justify-center">
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  </span>
                );
              }

              if (isActive) {
                return (
                  <button
                    className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted"
                    onClick={handleClear}
                    onPointerDown={handleClear}
                    type="button"
                  >
                    <RemoveIcon className="size-4" />
                  </button>
                );
              }

              return null;
            })()}
            <span className="min-w-0 truncate">{selectedLabel}</span>
          </span>
        </SelectValue>
      </GroupItem>
      <SelectPopup className="max-h-[min(var(--available-height),23rem)] w-56">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
