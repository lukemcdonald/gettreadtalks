import { describe, expect, test } from 'vitest';

import { isSentryEnabled } from './enabled';

describe('isSentryEnabled', () => {
  test('enables when a DSN is set and the flag is not false', () => {
    expect(isSentryEnabled('https://dsn.example/1')).toBe(true);
    expect(isSentryEnabled('https://dsn.example/1', 'true')).toBe(true);
  });

  test('stays off without a DSN', () => {
    expect(isSentryEnabled()).toBe(false);
    expect(isSentryEnabled('', 'true')).toBe(false);
  });

  test('stays off when the enabled flag is false', () => {
    expect(isSentryEnabled('https://dsn.example/1', 'false')).toBe(false);
  });
});
