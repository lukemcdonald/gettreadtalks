import type { EventMap } from '@/services/analytics/events';

import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const { mcpToolCallProperties } = await import('./analytics.ts');

describe('mcpToolCallProperties', () => {
  test('builds the MCP tool event payload', () => {
    const properties: EventMap['mcp_tool_called'] = mcpToolCallProperties({
      clientName: 'claude-code',
      clientVersion: '2.0.0',
      durationMs: 42,
      query: 'Romans 8',
      resultCount: 3,
      success: true,
      toolName: 'search_talks',
      userAgent: 'Claude-User/1.0',
    });

    assert.deepEqual(properties, {
      client_name: 'claude-code',
      client_version: '2.0.0',
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
