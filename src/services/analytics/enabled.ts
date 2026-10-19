export function isSegmentEnabled(
  writeKey?: string,
  enabled?: string,
  vercelEnv?: string
): boolean {
  return Boolean(writeKey) && enabled !== 'false' && vercelEnv === 'production';
}
