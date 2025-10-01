export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const THEME_CYCLE = {
  [THEMES.LIGHT]: THEMES.DARK,
  [THEMES.DARK]: THEMES.SYSTEM,
  [THEMES.SYSTEM]: THEMES.LIGHT,
} as const;

export const THEME_ICONS = {
  [THEMES.LIGHT]: '☀️',
  [THEMES.DARK]: '🌙',
  [THEMES.SYSTEM]: '💻',
} as const;
