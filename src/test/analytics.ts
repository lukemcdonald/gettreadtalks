import { expect, vi } from 'vitest';

import { track } from '@/services/analytics';

export function mockedTrack() {
  return vi.mocked(track);
}

export function expectTracked(
  event: string,
  properties?: Record<string, unknown>
) {
  if (properties === undefined) {
    expect(track).toHaveBeenCalledWith(event);

    return;
  }

  expect(track).toHaveBeenCalledWith(event, properties);
}

export function expectTrackedTimes(count: number) {
  expect(track).toHaveBeenCalledTimes(count);
}
