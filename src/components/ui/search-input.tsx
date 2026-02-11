'use client';

import { Input, Label } from '@/components/ui';
import { useDebouncedSearchParam } from '@/hooks/use-debounced-search-param';
import { cn } from '@/utils';

interface SearchInputProps {
  className?: string;
  label?: string;
  paramName?: string;
  placeholder?: string;
}

export function SearchInput({
  className,
  label,
  paramName = 'search',
  placeholder = 'Search...',
}: SearchInputProps) {
  const [value, setValue] = useDebouncedSearchParam(paramName);

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={paramName}>{label}</Label>}
      <Input
        id={paramName}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        size="lg"
        type="search"
        value={value}
      />
    </div>
  );
}
