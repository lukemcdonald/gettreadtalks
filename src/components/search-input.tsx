'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
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
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const urlValue = searchParams.get(paramName) ?? '';
  const [localValue, setLocalValue] = useState(urlValue);

  // Sync local value when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setLocalValue(urlValue);
  }, [urlValue]);

  // Debounced URL update
  useEffect(() => {
    // Don't update if values already match
    if (localValue === urlValue) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced update (300ms)
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (localValue.trim()) {
        params.set(paramName, localValue.trim());
      } else {
        params.delete(paramName);
      }

      params.delete('cursor');

      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    }, 300);

    // Cleanup timeout on unmount or value change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, urlValue, pathname, paramName, router, searchParams]);

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor={paramName}>{label}</Label>}
      <Input
        id={paramName}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={localValue}
      />
    </div>
  );
}
