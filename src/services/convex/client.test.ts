import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getConvexClient', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, '__treadTalksConvexReactClient__');
    vi.unstubAllEnvs();
  });

  it('reuses one ConvexReactClient across calls', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONVEX_URL', 'https://example.convex.cloud');

    const { getConvexClient } = await import('./client');

    expect(getConvexClient()).toBe(getConvexClient());
  });
});
