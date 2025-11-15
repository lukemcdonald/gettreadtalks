'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SearchInputProps = {
  className?: string;
  defaultValue?: string;
  label?: string;
  paramName?: string;
  placeholder?: string;
};

export function SearchInput({
  className,
  defaultValue,
  label,
  paramName = 'search',
  placeholder = 'Search...',
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set(paramName, value.trim());
      } else {
        params.delete(paramName);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [paramName, router, searchParams],
  );

  return (
    <div className={cn('flex-1 min-w-[200px]', className)}>
      {label && <Label htmlFor={paramName}>{label}</Label>}
      <Input
        defaultValue={defaultValue || searchParams.get(paramName) || ''}
        id={paramName}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}
