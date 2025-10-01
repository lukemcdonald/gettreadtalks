'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { THEMES, THEME_CYCLE, THEME_ICONS } from './theme-toggle.constants';
import type { Theme } from './theme-toggle.types';

const getNextTheme = (theme: string | undefined): Theme => {
  return THEME_CYCLE[theme as Theme] ?? THEMES.SYSTEM;
};

const getThemeIcon = (theme: string | undefined): string => {
  return THEME_ICONS[theme as Theme] ?? THEME_ICONS[THEMES.SYSTEM];
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(getNextTheme(theme))}
      className="inline-flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={theme}
    >
      <span className="text-lg">{getThemeIcon(theme)}</span>
    </button>
  );
}
