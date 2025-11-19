'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

export function ModeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      aria-label="Toggle theme"
      className={className}
      onClick={toggleTheme}
      size="icon-lg"
      title="Toggle theme"
      variant="ghost"
    >
      <ModeSwitcherIcon />
    </Button>
  );
}

const ModeSwitcherIcon = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={cn('-rotate-45 size-6 transition-all', className)}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="svgTitle">Mode Switcher</title>
    <path
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
    <path
      d="M5 20 19 5M16 9l6 4.853m-9.587-1.447 6.947 5.957M8 15.667l7 5.833"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
