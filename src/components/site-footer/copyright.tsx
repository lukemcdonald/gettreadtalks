'use client';

import { useEffect, useState } from 'react';

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

  return <span className={className}>© TREAD Talks {year}</span>;
}
