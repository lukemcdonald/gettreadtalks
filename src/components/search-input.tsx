'use client';

import { useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input, Label } from '@/components/ui';
import { cn } from '@/utils';

type SearchInputProps = {
  className?: string;
  label?: string;
  paramName?: string;
  placeholder?: string;
};

export function SearchInput({
  className,
  label,
  paramName = 'search',
  placeholder = 'Search...',
}: SearchInputProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Local state for responsive typing
  const [value, setValue] = useState(searchParams.get(paramName) ?? '');

  const handleChange = (newValue: string) => {
    // Update local state immediately for responsive UI
    setValue(newValue);

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the URL update to avoid hammering the database
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (newValue.trim()) {
        params.set(paramName, newValue.trim());
      } else {
        params.delete(paramName);
      }

      // Reset cursor when search changes
      params.delete('cursor');

      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    }, 300);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={paramName}>{label}</Label>}
      <Input
        id={paramName}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
