import type { EventMap } from '@/services/analytics/events';

import { describe, expect, test } from 'vitest';

import { mcpToolCallProperties } from './analytics';

describe('mcpToolCallProperties', () => {
  test('builds the MCP tool event payload', () => {
    const properties: EventMap['mcp_tool_called'] = mcpToolCallProperties({
      durationMs: 42,
      query: 'Romans 8',
      resultCount: 3,
      success: true,
      toolName: 'search_talks',
      userAgent: 'Claude-User/1.0',
    });

    expect(properties).toEqual({
      duration_ms: 42,
      error: undefined,
      query: 'Romans 8',
      result_count: 3,
      success: true,
      tool_name: 'search_talks',
      user_agent: 'Claude-User/1.0',
    });
  });
});
