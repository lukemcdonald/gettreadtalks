'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

  const value = searchParams.get(paramName) ?? '';

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue.trim()) {
      params.set(paramName, newValue.trim());
    } else {
      params.delete(paramName);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={paramName}>{label}</Label>}
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
