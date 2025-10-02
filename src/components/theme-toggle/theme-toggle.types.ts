import { THEME_CYCLE, THEME_ICONS, THEMES } from './theme-toggle.constants';

export type Theme = (typeof THEMES)[keyof typeof THEMES];
export type ThemeCycle = (typeof THEME_CYCLE)[keyof typeof THEME_CYCLE];
export type ThemeIcons = (typeof THEME_ICONS)[keyof typeof THEME_ICONS];
