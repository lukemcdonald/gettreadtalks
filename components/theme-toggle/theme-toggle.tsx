'use client';

import type { Theme } from './theme-toggle.types';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui';

import { THEMES, THEME_CYCLE, THEME_ICONS } from './theme-toggle.constants';

const getNextTheme = (theme: string | undefined): Theme => {
	return THEME_CYCLE[theme as Theme] ?? THEMES.SYSTEM;
};

const getThemeIcon = (theme: string | undefined): string => {
	return THEME_ICONS[theme as Theme] ?? THEME_ICONS[THEMES.SYSTEM];
};

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="w-10 h-10 bg-base-200 rounded animate-pulse" />;
	}

	return (
		<Button
			aria-label={`Current theme: ${theme}. Click to cycle themes.`}
			className="w-10 h-10 p-0"
			onClick={() => setTheme(getNextTheme(theme))}
			title={theme}
			type="button"
			variant="ghost"
		>
			<span className="text-lg">{getThemeIcon(theme)}</span>
		</Button>
	);
}
