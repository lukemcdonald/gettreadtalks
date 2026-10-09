import type { APIRequestContext, APIResponse } from '@playwright/test';

import { expect, test } from './fixtures/index.ts';

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

const SITE = 'https://www.gettreadtalks.com';

async function parseMcpResponse(response: APIResponse) {
  const text = await response.text();
  const payload = text
    .split('\n')
    .map((line) => line.replace(/^data:\s*/u, '').trim())
    .find((line) => line.startsWith('{'));

  return JSON.parse(payload ?? text) as {
    error?: { message: string };
    result?: {
      content?: { text?: string }[];
      serverInfo?: { name?: string };
      tools?: { name: string }[];
    };
  };
}

async function mcpRpc(
  request: APIRequestContext,
  method: string,
  params: Record<string, unknown>,
  id = 1
) {
  const response = await request.post('/mcp', {
    data: {
      id,
      jsonrpc: '2.0',
      method,
      params,
    },
    headers: MCP_HEADERS,
  });
  const body = await parseMcpResponse(response);

  expect(response.status(), `${method} ${response.status()}`).toBeLessThan(500);
  expect(response.status()).not.toBe(404);
  expect(body.error, JSON.stringify(body.error)).toBeUndefined();

  return body.result;
}

async function callTool(
  request: APIRequestContext,
  name: string,
  args: Record<string, unknown> = {}
) {
  const result = await mcpRpc(request, 'tools/call', {
    arguments: args,
    name,
  });
  const text = result?.content?.[0]?.text;
  expect(text).toBeTruthy();
  return JSON.parse(text ?? '{}') as Record<string, unknown>;
}

test('MCP / Initialize advertises the catalog', async ({ request }) => {
  const initialized = await mcpRpc(request, 'initialize', {
    capabilities: {},
    clientInfo: {
      name: 'playwright',
      version: '0.0.0',
    },
    protocolVersion: '2025-11-25',
  });

  expect(initialized?.serverInfo?.name).toBe('gettreadtalks');

  const listed = await mcpRpc(request, 'tools/list', {}, 2);
  const toolNames = listed?.tools?.map((tool) => tool.name) ?? [];

  expect(toolNames).toEqual(
    expect.arrayContaining([
      'get_clip',
      'get_collection',
      'get_talk',
      'list_clips',
      'list_collections',
      'list_speakers',
      'list_topics',
      'search_talks',
    ])
  );
});

test('MCP / Search and get talk return canonical urls', async ({ request }) => {
  const talks = await callTool(request, 'search_talks', { query: 'Romans' });
  const talkHits = talks.talks as { url?: string }[];
  expect(talkHits[0]?.url).toContain(`${SITE}/talks/`);

  const talk = await callTool(request, 'get_talk', {
    speakerSlug: 'john-doe',
    talkSlug: 'sample-sermon-on-romans-8',
  });
  const talkResult = talk.talk as { url?: string };
  expect(talkResult.url).toBe(
    `${SITE}/talks/john-doe/sample-sermon-on-romans-8`
  );
});

test('MCP / List speakers and topics return canonical urls', async ({
  request,
}) => {
  const speakers = await callTool(request, 'list_speakers', { search: 'John' });
  const speakerHits = speakers.speakers as { url?: string }[];
  expect(speakerHits[0]?.url).toContain(`${SITE}/speakers/`);

  const topics = await callTool(request, 'list_topics', { search: 'Grace' });
  const topicHits = topics.topics as { url?: string }[];
  expect(topicHits[0]?.url).toContain(`${SITE}/topics/`);
});

test('MCP / List and get collection return canonical urls', async ({
  request,
}) => {
  const collections = await callTool(request, 'list_collections');
  const collectionHits = collections.collections as {
    slug?: string;
    url?: string;
  }[];
  expect(collectionHits[0]?.url).toContain(`${SITE}/collections/`);

  const collection = await callTool(request, 'get_collection', {
    slug: collectionHits[0]?.slug ?? 'example-series-the-psalms',
  });
  const collectionTalks = collection.talks as { url?: string }[];
  expect(collectionTalks[0]?.url).toContain(`${SITE}/talks/`);
});

test('MCP / List and get clip return canonical urls', async ({ request }) => {
  const clips = await callTool(request, 'list_clips');
  const clipHits = clips.clips as { slug?: string; url?: string }[];
  expect(clipHits[0]?.url).toContain(`${SITE}/clips/`);

  const clip = await callTool(request, 'get_clip', {
    slug: clipHits[0]?.slug ?? 'sample-clip-no-condemnation',
  });
  const clipResult = clip.clip as { url?: string };
  expect(clipResult.url).toContain(`${SITE}/clips/`);
});
