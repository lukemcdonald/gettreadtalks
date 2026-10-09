import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { authorizeMcpLimiter, mcpLimiterToken } from './mcpToken.ts';

describe('authorizeMcpLimiter', () => {
  test('rejects an invalid token', () => {
    assert.deepEqual(authorizeMcpLimiter('nope', 'server-secret'), {
      ok: false,
      retryAfter: 60_000,
    });
  });

  test('rejects when the secret is missing', () => {
    assert.deepEqual(authorizeMcpLimiter('any-token'), {
      ok: false,
      retryAfter: 60_000,
    });
  });

  test('allows a token derived from the secret', () => {
    const secret = 'server-secret';
    const token = mcpLimiterToken(secret);

    assert.ok(token);
    assert.equal(authorizeMcpLimiter(token, secret), undefined);
  });
});
