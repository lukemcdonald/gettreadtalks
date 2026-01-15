import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Custom hook for managing a debounced search parameter in the URL.
 *
 * Maintains local state for immediate UI updates while debouncing URL changes
 * to prevent excessive navigation and improve performance.
 *
 * @param paramName - The URL search parameter name (e.g., 'search', 'query')
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Tuple of [value, setValue] similar to useState
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useDebouncedSearchParam('search', 300);
 * return <Input value={search} onChange={(e) => setSearch(e.target.value)} />
 * ```
 */
export function useDebouncedSearchParam(paramName: string, delay = 300) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);

  pathnameRef.current = pathname;
  searchParamsRef.current = searchParams;
  routerRef.current = router;

  const urlValue = searchParams.get(paramName) ?? '';
  const [localValue, setLocalValue] = useState(urlValue);

  // Track whether user has pending edits that haven't synced to URL yet
  const hasPendingEditRef = useRef(false);

  // Sync from URL only when user is not actively editing
  // This handles external URL changes (back navigation, direct URL entry)
  useEffect(() => {
    if (!hasPendingEditRef.current) {
      setLocalValue(urlValue);
    }
  }, [urlValue]);

  useEffect(() => {
    if (localValue === urlValue) {
      hasPendingEditRef.current = false;
      return;
    }

    hasPendingEditRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

      if (localValue.trim()) {
        params.set(paramName, localValue.trim());
      } else {
        params.delete(paramName);
      }

      params.delete('cursor');

      startTransition(() => {
        const query = params.toString();
        routerRef.current.push(query ? `${pathnameRef.current}?${query}` : pathnameRef.current, {
          scroll: false,
        });
      });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, urlValue, delay, paramName]);

  return [localValue, setLocalValue] as const;
}
