'use client';

import { useDebouncedSearchParam } from '@/hooks/use-debounced-search-param';
import { cn } from '@/utils';

import { Input } from './primitives/input';
import { Label } from './primitives/label';

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
