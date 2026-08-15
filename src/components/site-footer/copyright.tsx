import { cacheLife } from 'next/cache';

import { site } from '@/configs/site';

interface CopyrightProps {
  className?: string;
}

// oxlint-disable-next-line require-await -- `use cache` requires an async function
async function getCopyrightYear() {
  'use cache';
  cacheLife('hours');

  return new Date().getFullYear();
}

export async function Copyright({ className }: CopyrightProps) {
  const year = await getCopyrightYear();

  return (
    <span className={className}>
      &copy; {site.name} {year}
    </span>
  );
}
