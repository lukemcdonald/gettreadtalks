import { describe, expect, it } from '@/test';

import { createMcpRateLimitedHandler, mcpRateLimitKey } from './rate-limit';

function mcpRequest(headers: Record<string, string>) {
  return new Request('https://www.gettreadtalks.com/mcp', {
    headers,
    method: 'POST',
  });
}

describe('mcpRateLimitKey', () => {
  it('prefers cf-connecting-ip over x-forwarded-for', () => {
    const key = mcpRateLimitKey(
      mcpRequest({
        'cf-connecting-ip': '1.1.1.1',
        'x-forwarded-for': '8.8.8.8',
      })
    );

    expect(key).toBe('1.1.1.1');
  });

  it('prefers x-real-ip over x-forwarded-for', () => {
    const key = mcpRateLimitKey(
      mcpRequest({
        'x-forwarded-for': '8.8.8.8',
        'x-real-ip': '9.9.9.9',
      })
    );

    expect(key).toBe('9.9.9.9');
  });

  it('hashes the trusted ip when a server secret is set', () => {
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

    expect(spoofed).toBe(trusted);
    expect(spoofed).not.toBe('9.9.9.9');
  });
});

describe('createMcpRateLimitedHandler', () => {
  const passthrough = createMcpRateLimitedHandler(
    (request) => {
      if (request.headers.get('x-test-handler') === 'throw') {
        return Promise.reject(new Error('handler unavailable'));
      }

      return Promise.resolve(Response.json({ ok: true }));
    },
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

  it('allows a request when the limiter grants a token', async () => {
    const response = await passthrough(mcpRequest({}));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it('returns 429 with retry-after when the limiter denies', async () => {
    const response = await passthrough(mcpRequest({ 'x-test-limit': 'deny' }));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('15');
    expect(body).toEqual({ error: 'Rate limit exceeded' });
  });

  it('fails open when the limiter throws', async () => {
    const response = await passthrough(mcpRequest({ 'x-test-limit': 'throw' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
  });

  it('returns a cors-wrapped 500 when the handler throws', async () => {
    const response = await passthrough(
      mcpRequest({ 'x-test-handler': 'throw' })
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(body).toEqual({ error: 'Internal Server Error' });
  });
});
