import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { createMcpRateLimitedHandler, mcpRateLimitKey } from './rate-limit.ts';

function mcpRequest(headers: Record<string, string>) {
  return new Request('https://www.gettreadtalks.com/mcp', {
    headers,
    method: 'POST',
  });
}

describe('mcpRateLimitKey', () => {
  test('prefers cf-connecting-ip over x-forwarded-for', () => {
    const key = mcpRateLimitKey(
      mcpRequest({
        'cf-connecting-ip': '1.1.1.1',
        'x-forwarded-for': '8.8.8.8',
      })
    );

    assert.equal(key, '1.1.1.1');
  });

  test('prefers x-real-ip over x-forwarded-for', () => {
    const key = mcpRateLimitKey(
      mcpRequest({
        'x-forwarded-for': '8.8.8.8',
        'x-real-ip': '9.9.9.9',
      })
    );

    assert.equal(key, '9.9.9.9');
  });

  test('hashes the trusted ip when a server secret is set', () => {
    const spoofed = mcpRateLimitKey(
      mcpRequest({
        'x-forwarded-for': '8.8.8.8',
        'x-real-ip': '9.9.9.9',
      }),
      'server-secret'
    );
    const trusted = mcpRateLimitKey(
      mcpRequest({ 'x-real-ip': '9.9.9.9' }),
      'server-secret'
    );

    assert.equal(spoofed, trusted);
    assert.notEqual(spoofed, '9.9.9.9');
  });
});

describe('createMcpRateLimitedHandler', () => {
  const passthrough = createMcpRateLimitedHandler(
    () => Promise.resolve(Response.json({ ok: true })),
    (request) => {
      const header = request.headers.get('x-test-limit');

      if (header === 'throw') {
        return Promise.reject(new Error('limiter unavailable'));
      }

      if (header === 'deny') {
        return Promise.resolve({ ok: false, retryAfter: 15_000 });
      }

      return Promise.resolve({ ok: true, retryAfter: null });
    }
  );

  test('allows a request when the limiter grants a token', async () => {
    const response = await passthrough(mcpRequest({}));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { ok: true });
  });

  test('returns 429 with retry-after when the limiter denies', async () => {
    const response = await passthrough(mcpRequest({ 'x-test-limit': 'deny' }));
    const body = await response.json();

    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Retry-After'), '15');
    assert.deepEqual(body, { error: 'Rate limit exceeded' });
  });

  test('fails open when the limiter throws', async () => {
    const response = await passthrough(mcpRequest({ 'x-test-limit': 'throw' }));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { ok: true });
  });
});
