import type * as AnalyticsClient from './client';

import { AnalyticsBrowser } from '@segment/analytics-next';
import { vi } from 'vitest';

import { afterEach, beforeEach, describe, expect, it } from '@/test';

vi.mock('@segment/analytics-next', () => ({
  AnalyticsBrowser: {
    load: vi.fn(),
  },
}));

describe('analytics client', () => {
  const WRITE_KEY = 'test-write-key';

  let analytics: typeof AnalyticsClient;
  const segmentTrack = vi.fn();

  async function loadClientModule() {
    vi.resetModules();
    analytics = await import('./client');
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    segmentTrack.mockReset();
    vi.mocked(AnalyticsBrowser.load).mockReset();
    vi.mocked(AnalyticsBrowser.load).mockResolvedValue([
      { track: segmentTrack },
    ] as never);
    vi.stubEnv('NEXT_PUBLIC_SEGMENT_WRITE_KEY', WRITE_KEY);
    await loadClientModule();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('does not load Segment until the browser is idle', async () => {
    analytics.loadAnalytics();

    expect(AnalyticsBrowser.load).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(AnalyticsBrowser.load).toHaveBeenCalledTimes(1);
    expect(AnalyticsBrowser.load).toHaveBeenCalledWith({ writeKey: WRITE_KEY });
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

    expect(AnalyticsBrowser.load).not.toHaveBeenCalled();
    expect(segmentTrack).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await Promise.all([first, second]);

    expect(AnalyticsBrowser.load).toHaveBeenCalledTimes(1);
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
});
