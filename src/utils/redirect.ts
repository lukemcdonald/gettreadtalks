/** Returns the redirect param if it is a relative path, otherwise the fallback. */
export function getSafeRedirect(param: string | null, fallback = '/account'): string {
  const redirect = param ?? fallback;
  return redirect.startsWith('/') ? redirect : fallback;
}
