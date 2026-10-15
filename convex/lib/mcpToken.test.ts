import { describe, expect, it } from 'vitest';

import { authorizeMcpLimiter, mcpLimiterToken } from './mcpToken';

describe('authorizeMcpLimiter', () => {
  it('rejects an invalid token', () => {
    expect(authorizeMcpLimiter('nope', 'server-secret')).toEqual({
      ok: false,
      retryAfter: 60_000,
    });
  });

  it('rejects when the secret is missing', () => {
    expect(authorizeMcpLimiter('any-token')).toEqual({
      ok: false,
      retryAfter: 60_000,
    });
  });

  it('allows a token derived from the secret', () => {
    const secret = 'server-secret';
    const token = mcpLimiterToken(secret);

    if (!token) {
      throw new Error('expected limiter token');
    }

    expect(authorizeMcpLimiter(token, secret)).toBeUndefined();
  });
});
