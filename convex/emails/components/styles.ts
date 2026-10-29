/**
 * sRGB stand-ins for `src/assets/theme.css` tokens. Email clients do not
 * honor CSS variables or oklch.
 */
export const emailColors = {
  background: '#f4f4f5',
  border: '#e4e4e7',
  card: '#ffffff',
  foreground: '#27272a',
  muted: '#52525b',
  mutedFaint: '#a1a1aa',
  mutedSoft: '#71717a',
  primary: '#c10007',
  primaryForeground: '#fafafa',
};

export const emailFontFamily =
  'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export const emailButton = {
  backgroundColor: emailColors.primary,
  borderRadius: '8px',
  color: emailColors.primaryForeground,
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  padding: '12px 24px',
  textDecoration: 'none',
};

export const emailButtonContainer = {
  margin: '24px 0 8px',
  textAlign: 'center' as const,
};

export const emailFallbackLink = {
  color: emailColors.mutedFaint,
  display: 'block',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

export const emailHeading = {
  color: emailColors.foreground,
  fontSize: '22px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 16px',
  padding: '0',
};

export const emailParagraph = {
  color: emailColors.foreground,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

export const emailSupportLink = {
  color: emailColors.muted,
  textDecoration: 'underline',
};
