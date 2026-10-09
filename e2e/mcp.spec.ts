import type { APIRequestContext } from '@playwright/test';

import { expect, test } from './fixtures.ts';

const MCP_HEADERS = {
  Accept: 'application/json, text/event-stream',
  'Content-Type': 'application/json',
  ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? {
        'x-vercel-protection-bypass':
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
      }
    : {}),
};

async function mcpRpc(
  request: APIRequestContext,
  method: string,
  params: Record<string, unknown>
) {
  return await request.post('/mcp', {
    data: {
      id: 1,
      jsonrpc: '2.0',
      method,
      params,
    },
    headers: MCP_HEADERS,
  });
}

test('mcp initialize is reachable', async ({ request }) => {
  const response = await mcpRpc(request, 'initialize', {
    capabilities: {},
    clientInfo: {
      name: 'playwright',
      version: '0.0.0',
    },
    protocolVersion: '2025-11-25',
  });

  expect(response.status()).not.toBe(404);
  expect(response.status()).toBeLessThan(500);

  const body = await response.text();
  expect(body).toContain('gettreadtalks');
});
