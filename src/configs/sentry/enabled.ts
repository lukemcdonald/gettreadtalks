export function isSentryEnabled(dsn?: string, enabled?: string): boolean {
  return enabled !== 'false' && Boolean(dsn);
}
