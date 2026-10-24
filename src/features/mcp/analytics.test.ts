import { vi } from 'vitest';

import { scheduleServerTrack } from '@/services/analytics/server';
import { describe, expect, it } from '@/test';

import { withToolTracking } from './analytics';

vi.mock('@/services/analytics/server', () => ({
  scheduleServerTrack: vi.fn(),
}));

function loadLastTrack() {
  const build = vi.mocked(scheduleServerTrack).mock.calls.at(-1)?.[0] as
    | (() => Promise<{
        event: string;
        properties: Record<string, unknown>;
      }>)
    | undefined;

  if (!build) {
    throw new Error('expected a scheduled track');
  }

  return build();
}

describe('withToolTracking', () => {
  it('tracks success, tool error, and throw', async () => {
    const search = withToolTracking('search_talks', (_args?: object) => ({
      isError: false,
    }));

    await search({});

    const success = await loadLastTrack();

    expect(success.event).toBe('mcp_tool_called');
    expect(success.properties.error).toBeUndefined();
    expect(success.properties.success).toBe(true);
    expect(success.properties.tool_name).toBe('search_talks');

    const fail = withToolTracking('get_talk', (_args?: object) => ({
      isError: true,
    }));

    await fail({});

    const toolError = await loadLastTrack();

    expect(toolError.event).toBe('mcp_tool_called');
    expect(toolError.properties.error).toBe('tool_error');
    expect(toolError.properties.success).toBe(false);
    expect(toolError.properties.tool_name).toBe('get_talk');

    const boom = withToolTracking('get_clip', (_args?: object) => {
      throw new Error('backend down');
    });

    await expect(boom({})).rejects.toThrow('backend down');

    const thrown = await loadLastTrack();

    expect(thrown.event).toBe('mcp_tool_called');
    expect(thrown.properties.error).toBe('exception');
    expect(thrown.properties.success).toBe(false);
    expect(thrown.properties.tool_name).toBe('get_clip');
  });
});
