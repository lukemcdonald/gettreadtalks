import { vi } from 'vitest';

import {
  describe,
  expect,
  expectTracked,
  expectTrackedTimes,
  it,
  mockedTrack,
} from '@/test';

import { withToolTracking } from './analytics';

vi.mock('@/services/analytics', () => ({
  track: vi.fn(),
}));

describe('withToolTracking', () => {
  it('tracks success, tool error, and throw without query text', async () => {
    const query = 'Romans 8 unique-query';
    const search = withToolTracking(
      'search_talks',
      (_input: { q: string }) => ({})
    );

    await search({ q: query });

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      success: true,
      tool_name: 'search_talks',
    });
    expect(JSON.stringify(mockedTrack().mock.calls)).not.toContain(query);

    mockedTrack().mockClear();
    const fail = withToolTracking('search_talks', () => ({
      code: 'INVALID_QUERY',
      error: 'A search query is required.',
    }));
    await fail();

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      error: 'INVALID_QUERY',
      success: false,
      tool_name: 'search_talks',
    });
    expect(JSON.stringify(mockedTrack().mock.calls)).not.toContain(query);

    mockedTrack().mockClear();
    const boom = withToolTracking('open_talk', () => {
      throw new Error('backend down');
    });

    await expect(boom()).rejects.toThrow('backend down');
    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      error: 'EXCEPTION',
      success: false,
      tool_name: 'open_talk',
    });
  });
});
