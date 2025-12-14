'use client';

import { LoaderCircleIcon, X as RemoveIcon } from 'lucide-react';

import { GroupItem, Input } from '@/components/ui';
import { cn } from '@/utils';

type SearchInputProps = {
  className?: string;
  isPending?: boolean;
  onValueChange: (value: string) => void;
  pendingFilter?: string | null;
  placeholder?: string;
  value: string;
};

export function SearchInput({
  className,
  isPending,
  onValueChange,
  pendingFilter,
  placeholder = 'Search talks...',
  value,
}: SearchInputProps) {
  const isLoading = isPending && pendingFilter === 'search' && value;

  return (
    <GroupItem className={cn('relative min-w-[200px] max-w-[300px] flex-1', className)}>
      <div className="relative flex w-full items-center">
        {value && (
          <button
            className="absolute left-3 z-10 flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            onClick={() => onValueChange('')}
            type="button"
          >
            <RemoveIcon className="size-4 text-muted-foreground" />
          </button>
        )}
        {isLoading && (
          <LoaderCircleIcon className="absolute left-10 z-10 size-4 animate-spin text-muted-foreground" />
        )}
        <Input
          className="!rounded-none !border-0 !shadow-none before:!shadow-none [&[data-slot=input-control]]:!border-0 h-full w-full pr-3 pl-8 ring-0 [&[data-slot=input-control]]:bg-background"
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </div>
    </GroupItem>
  );
}
