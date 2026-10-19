import type * as AnalyticsClient from './client';

import { afterEach, beforeEach, describe, expect, it, vi } from '@/test';

describe('analytics client', () => {
  const MOCK_IDLE_TIMEOUT_MS = 2000;
  const MOCK_WRITE_KEY = 'test-write-key';
  const segmentLoad = vi.fn();
  const segmentTrack = vi.fn();

  let analytics: typeof AnalyticsClient;

  async function loadClientModule() {
    vi.resetModules();
    vi.doMock('@segment/analytics-next', () => ({
      AnalyticsBrowser: {
        load: segmentLoad,
      },
    }));
    analytics = await import('./client');
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    segmentLoad.mockReset();
    segmentTrack.mockReset();
    segmentLoad.mockResolvedValue([{ track: segmentTrack }]);
    vi.stubEnv('NEXT_PUBLIC_SEGMENT_WRITE_KEY', MOCK_WRITE_KEY);
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production');
    await loadClientModule();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('does not load Segment until the browser is idle', async () => {
    analytics.loadAnalytics();

    expect(segmentLoad).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(MOCK_IDLE_TIMEOUT_MS);

    expect(segmentLoad).toHaveBeenCalledTimes(1);
    expect(segmentLoad).toHaveBeenCalledWith({ writeKey: MOCK_WRITE_KEY });
  });

  it('queues track calls and flushes them after idle load', async () => {
    analytics.loadAnalytics();

    const first = analytics.trackEvent('talk_played', {
      media_type: 'audio',
      talk_id: 'talks:romans-8',
      talk_slug: 'romans-8',
    });
    const second = analytics.trackEvent('talk_paused', {
      progress_pct: 40,
      talk_id: 'talks:romans-8',
      talk_slug: 'romans-8',
    });

    expect(segmentLoad).not.toHaveBeenCalled();
    expect(segmentTrack).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(MOCK_IDLE_TIMEOUT_MS);
    await Promise.all([first, second]);

    expect(segmentLoad).toHaveBeenCalledTimes(1);
    expect(segmentTrack).toHaveBeenNthCalledWith(1, 'talk_played', {
      media_type: 'audio',
      talk_id: 'talks:romans-8',
      talk_slug: 'romans-8',
    });
    expect(segmentTrack).toHaveBeenNthCalledWith(2, 'talk_paused', {
      progress_pct: 40,
      talk_id: 'talks:romans-8',
      talk_slug: 'romans-8',
    });
  });

  it('does not load Segment when the kill switch is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_SEGMENT_ENABLED', 'false');
    await loadClientModule();

    analytics.loadAnalytics();
    await vi.advanceTimersByTimeAsync(MOCK_IDLE_TIMEOUT_MS);

    expect(segmentLoad).not.toHaveBeenCalled();
  });
});
