'use client';

import { useEffect, useState } from 'react';

import { site } from '@/configs/site';

interface CopyrightProps {
  className?: string;
}

export function Copyright({ className }: CopyrightProps) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (!year) {
    return null;
  }

  return (
    <span className={className}>
      © {site.name} {year}
    </span>
  );
}
