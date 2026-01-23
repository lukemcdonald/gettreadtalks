/**
 * Locks html scroll while a sheet route is active. Uses React 19's style
 * deduplication (href prop) so the lock persists across loading → page swaps.
 */
export function SheetScrollLock() {
  return (
    <style href="sheet-scroll-lock" precedence="high">
      {'html { overflow: hidden !important; }'}
    </style>
  );
}
