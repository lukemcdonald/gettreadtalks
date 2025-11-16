'use client';

import { LoaderCircleIcon, X as RemoveIcon } from 'lucide-react';

import { GroupItem } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    <GroupItem className={cn('relative flex-1 min-w-[200px] max-w-[300px]', className)}>
      <div className="relative flex w-full items-center">
        {value && (
          <button
            className="absolute left-3 z-10 flex size-6 items-center justify-center rounded-md hover:bg-muted transition-colors"
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
          className="h-full w-full !rounded-none !border-0 pl-8 pr-3 !shadow-none before:!shadow-none ring-0 [&[data-slot=input-control]]:!border-0 [&[data-slot=input-control]]:bg-background"
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </div>
    </GroupItem>
  );
}
