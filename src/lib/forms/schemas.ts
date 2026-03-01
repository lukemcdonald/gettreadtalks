type StripEmptyStrings<T> = {
  [K in keyof T]: Exclude<T[K], ''>;
};

/**
 * Strips empty strings from form data, converting them to undefined.
 *
 * HTML form inputs produce '' for blank fields, but Convex expects
 * undefined for absent optional values. Call this before passing
 * parsed form data to Convex mutations.
 */
export function stripEmptyStrings<T extends Record<string, unknown>>(
  data: T,
): StripEmptyStrings<T> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? undefined : value]),
  ) as StripEmptyStrings<T>;
}
