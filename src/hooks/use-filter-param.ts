'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function useFilterParam(name: string) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = searchParams.get(name);

  function update(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function updateUnlessDefault(value: string | null, defaultValue: string) {
    update(valueToKeep(value, defaultValue));
  }

  return { current, isPending, update, updateUnlessDefault };
}

function valueToKeep(value: string | null, defaultValue: string) {
  if (value && value !== defaultValue) {
    return value;
  }

  return null;
}
