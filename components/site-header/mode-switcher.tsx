'use client';

import { useCallback } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative size-8"
      onClick={toggleTheme}
      title="Toggle theme"
    >
      <ModeSwitcherIcon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

const ModeSwitcherIcon = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn('-rotate-45 size-4', className)}
    >
      <title id="svgTitle">Mode Switcher</title>
      <path
        stroke="currentColor"
        strokeWidth={strokeWidth}
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
      />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 20 19 5M16 9l6 4.853m-9.587-1.447 6.947 5.957M8 15.667l7 5.833"
      />
    </svg>
  );
};
