import type { APIRequestContext, APIResponse } from '@playwright/test';

import {
  PREVIEW_CLIP_NO_CONDEMNATION,
  PREVIEW_COLLECTION_THE_PSALMS,
  PREVIEW_SPEAKER_JOHN_DOE,
  PREVIEW_TALK_ROMANS_8,
  PREVIEW_TOPIC_GRACE,
} from '../convex/previewFixtures.ts';
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

function expectSiteUrl(url: string | undefined, pathPrefix: string) {
  expect(url).toContain(`${SITE}${pathPrefix}`);
}

function getFirstHit(result: Record<string, unknown>, key: string) {
  const hits = result[key];
  expect(Array.isArray(hits)).toBe(true);
  const [hit] = (hits ?? []) as { slug?: string; url?: string }[];
  expect(hit).toBeDefined();

  return hit ?? {};
}

test(
  'MCP / Initialize advertises the catalog',
  { tag: '@smoke' },
  async ({ request }) => {
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
  }
);

test('MCP / Catalog tools return canonical urls', async ({ request }) => {
  const talks = await callTool(request, 'search_talks', { query: 'Romans' });
  expectSiteUrl(getFirstHit(talks, 'talks').url, '/talks/');

  const talk = await callTool(request, 'get_talk', {
    speakerSlug: PREVIEW_TALK_ROMANS_8.speakerSlug,
    talkSlug: PREVIEW_TALK_ROMANS_8.slug,
  });
  const talkResult = talk.talk as { url?: string };
  expect(talkResult.url).toBe(
    `${SITE}/talks/${PREVIEW_TALK_ROMANS_8.speakerSlug}/${PREVIEW_TALK_ROMANS_8.slug}`
  );

  const speakers = await callTool(request, 'list_speakers', {
    search: PREVIEW_SPEAKER_JOHN_DOE.firstName,
  });
  expectSiteUrl(getFirstHit(speakers, 'speakers').url, '/speakers/');

  const topics = await callTool(request, 'list_topics', {
    search: PREVIEW_TOPIC_GRACE.title,
  });
  expectSiteUrl(getFirstHit(topics, 'topics').url, '/topics/');

  const collections = await callTool(request, 'list_collections');
  const collectionHit = getFirstHit(collections, 'collections');
  expectSiteUrl(collectionHit.url, '/collections/');

  const collection = await callTool(request, 'get_collection', {
    slug: collectionHit.slug ?? PREVIEW_COLLECTION_THE_PSALMS.slug,
  });
  expectSiteUrl(getFirstHit(collection, 'talks').url, '/talks/');

  const clips = await callTool(request, 'list_clips');
  const clipHit = getFirstHit(clips, 'clips');
  expectSiteUrl(clipHit.url, '/clips/');

  const clip = await callTool(request, 'get_clip', {
    slug: clipHit.slug ?? PREVIEW_CLIP_NO_CONDEMNATION.slug,
  });
  const clipResult = clip.clip as { url?: string };
  expectSiteUrl(clipResult.url, '/clips/');
});
