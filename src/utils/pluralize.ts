const pluralRules = new Intl.PluralRules('en-US');

/**
 * Returns the correct plural form based on count using Intl.PluralRules.
 */
export function pluralize(count: number, singular: string, plural: string): string {
  const rule = pluralRules.select(count);
  return rule === 'one' ? singular : plural;
}
