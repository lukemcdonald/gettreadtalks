export function isSegmentEnabled(writeKey?: string, enabled?: string): boolean {
  return Boolean(writeKey) && enabled !== 'false';
}
