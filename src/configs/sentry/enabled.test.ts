import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { isSentryEnabled } from './enabled.ts';

describe('isSentryEnabled', () => {
  test('enables when a DSN is set and the flag is not false', () => {
    assert.equal(isSentryEnabled('https://dsn.example/1'), true);
    assert.equal(isSentryEnabled('https://dsn.example/1', 'true'), true);
  });

  test('stays off without a DSN', () => {
    assert.equal(isSentryEnabled(), false);
    assert.equal(isSentryEnabled('', 'true'), false);
  });

  test('stays off when the enabled flag is false', () => {
    assert.equal(isSentryEnabled('https://dsn.example/1', 'false'), false);
  });
});
