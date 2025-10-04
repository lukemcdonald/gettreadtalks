export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export const THEME_CYCLE = {
  [THEMES.DARK]: THEMES.SYSTEM,
  [THEMES.LIGHT]: THEMES.DARK,
  [THEMES.SYSTEM]: THEMES.LIGHT,
} as const;

export const THEME_ICONS = {
  [THEMES.DARK]: '🌙',
  [THEMES.LIGHT]: '☀️',
  [THEMES.SYSTEM]: '💻',
} as const;
