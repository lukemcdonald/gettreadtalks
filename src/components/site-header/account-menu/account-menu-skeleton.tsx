/**
 * Placeholder that reserves space for account menu during SSR streaming.
 * Keeps layout stable while auth-dependent content resolves.
 */
export function AccountMenuSkeleton() {
  return (
    <>
      {/* Mobile: reserve icon button space */}
      <div aria-hidden className="size-10 lg:hidden" />

      {/* Desktop: reserve space for either icon or text link */}
      <div aria-hidden className="hidden h-10 w-20 lg:block" />
    </>
  );
}
