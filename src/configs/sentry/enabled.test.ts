import { describe, expect, it } from '@/test';

import { isSentryEnabled } from './enabled';

describe('isSentryEnabled', () => {
  it('enables when a DSN is set and the flag is not false', () => {
    expect(isSentryEnabled('https://dsn.example/1')).toBe(true);
    expect(isSentryEnabled('https://dsn.example/1', 'true')).toBe(true);
  });

  it('stays off without a DSN', () => {
    expect(isSentryEnabled()).toBe(false);
    expect(isSentryEnabled('', 'true')).toBe(false);
  });

  it('stays off when the enabled flag is false', () => {
    expect(isSentryEnabled('https://dsn.example/1', 'false')).toBe(false);
  });
});
