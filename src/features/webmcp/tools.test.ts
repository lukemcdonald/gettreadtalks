import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexReactClient } from 'convex/react';

import { getFunctionName } from 'convex/server';

import { buildSearchPageHref } from '@/features/search/utils';
import { describe, expect, it, vi } from '@/test';

import { registerSignedInWebMcpTools, registerWebMcpTools } from './tools';

const origin = 'https://www.gettreadtalks.com';

const john = {
  firstName: 'John',
  lastName: 'Doe',
  ministry: 'Sample Chapel',
  slug: 'john-doe',
};

const romansTalk = {
  publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
  scripture: 'Romans 8:28',
  slug: 'sample-sermon-on-romans-8',
  speaker: john,
  title: 'Sample Sermon on Romans 8',
  topicSlugs: ['grace'],
};

function getExecute(registerTool: ReturnType<typeof vi.fn>, name: string) {
  const tool = registerTool.mock.calls
    .map(
      ([registered]) =>
        registered as {
          execute?: (
            input: Record<string, unknown>,
            options: { signal: AbortSignal }
          ) => Promise<unknown>;
          name: string;
        }
    )
    .find((registered) => registered.name === name);

  if (!tool?.execute) {
    throw new Error(`missing ${name}`);
  }

  return tool.execute;
}

describe('registerWebMcpTools', () => {
  it('is a no-op when modelContext is missing', async () => {
    const navigate = vi.fn();
    const searchTalks = vi.fn();

    await registerWebMcpTools({
      document: {},
      navigate,
      origin,
      searchTalks,
      signal: new AbortController().signal,
    });

    expect(navigate).not.toHaveBeenCalled();
    expect(searchTalks).not.toHaveBeenCalled();
  });

  it('search_talks returns formatted talks and navigates to the search page', async () => {
    const navigate = vi.fn();
    const registerTool = vi.fn(async () => {});
    const searchTalks = vi.fn().mockResolvedValue({ talks: [romansTalk] });

    await registerWebMcpTools({
      document: { modelContext: { registerTool } },
      navigate,
      origin,
      searchTalks,
      signal: new AbortController().signal,
    });

    const result = await getExecute(registerTool, 'search_talks')(
      { query: 'Romans' },
      { signal: new AbortController().signal }
    );

    expect(navigate).toHaveBeenCalledWith(buildSearchPageHref('Romans'));
    expect(searchTalks).toHaveBeenCalledWith({
      limit: 5,
      search: 'Romans',
    });
    expect(result).toEqual({
      talks: [
        {
          publishedAt: '2024-06-03T12:00:00.000Z',
          scripture: 'Romans 8:28',
          slug: 'sample-sermon-on-romans-8',
          speaker: {
            ministry: 'Sample Chapel',
            name: 'John Doe',
            slug: 'john-doe',
            url: 'https://www.gettreadtalks.com/speakers/john-doe',
          },
          title: 'Sample Sermon on Romans 8',
          topics: ['grace'],
          url: 'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8',
        },
      ],
    });
  });

  it.each([
    {
      expected: { href: '/talks/john-doe/sample-sermon-on-romans-8' },
      navigates: true,
      origin: 'http://localhost:3000',
      talk: 'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8',
    },
    {
      expected: expect.objectContaining({ code: 'CROSS_ORIGIN' }),
      navigates: false,
      talk: 'https://evil.example/talks/john-doe/x',
    },
    {
      expected: expect.objectContaining({ code: 'INVALID_TALK' }),
      navigates: false,
      talk: '/manage/talks',
    },
  ])(
    'open_talk handles $talk',
    async ({ expected, navigates, origin: pageOrigin = origin, talk }) => {
      const navigate = vi.fn();
      const registerTool = vi.fn(async () => {});

      await registerWebMcpTools({
        document: { modelContext: { registerTool } },
        navigate,
        origin: pageOrigin,
        searchTalks: vi.fn(),
        signal: new AbortController().signal,
      });

      const result = await getExecute(registerTool, 'open_talk')(
        { talk },
        { signal: new AbortController().signal }
      );

      expect(result).toEqual(expected);

      if (navigates) {
        expect(navigate).toHaveBeenCalledWith(
          '/talks/john-doe/sample-sermon-on-romans-8'
        );
        return;
      }

      expect(navigate).not.toHaveBeenCalled();
    }
  );
});

const talkId = 'talks:romans' as Id<'talks'>;

describe('registerSignedInWebMcpTools', () => {
  async function registerFlags(enabled: boolean, status = 'published') {
    const mutate = vi.fn(
      (
        _reference: Parameters<typeof getFunctionName>[0],
        _args: { talkId: Id<'talks'> }
      ) => null
    );
    const query = vi.fn((reference: Parameters<typeof getFunctionName>[0]) => {
      if (getFunctionName(reference) === 'talks:getTalkBySlug') {
        return {
          speaker: john,
          talk: { ...romansTalk, _id: talkId, status },
          topics: [{ slug: 'grace' }],
        };
      }

      return !enabled;
    });
    const registerTool = vi.fn(() => Promise.resolve());

    await registerSignedInWebMcpTools({
      document: { modelContext: { registerTool } },
      mutate: mutate as unknown as ConvexReactClient['mutation'],
      origin,
      query: query as unknown as ConvexReactClient['query'],
      refreshLists: vi.fn(() => Promise.resolve()),
      signal: new AbortController().signal,
    });

    return { mutate, registerTool };
  }

  it.each([
    { enabled: true, mutation: 'users:favoriteTalk', tool: 'set_favorite' },
    { enabled: false, mutation: 'users:unfavoriteTalk', tool: 'set_favorite' },
    { enabled: true, mutation: 'users:finishTalk', tool: 'set_finished' },
    { enabled: false, mutation: 'users:unfinishTalk', tool: 'set_finished' },
  ])(
    '$tool calls $mutation when enabled is $enabled',
    async ({ enabled, mutation, tool }) => {
      const { mutate, registerTool } = await registerFlags(enabled);

      await getExecute(registerTool, tool)(
        { enabled, talk: '/talks/john-doe/sample-sermon-on-romans-8' },
        { signal: new AbortController().signal }
      );

      expect(mutate).toHaveBeenCalledTimes(1);
      expect(getFunctionName(mutate.mock.calls[0][0])).toBe(mutation);
      expect(mutate.mock.calls[0][1]).toEqual({ talkId });
    }
  );

  it('does not change an unpublished talk', async () => {
    const { mutate, registerTool } = await registerFlags(true, 'approved');
    const result = await getExecute(registerTool, 'set_favorite')(
      { enabled: true, talk: '/talks/john-doe/sample-sermon-on-romans-8' },
      { signal: new AbortController().signal }
    );

    expect(result).toHaveProperty('error');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('returns an error for a talk that is not on this site', async () => {
    const { mutate, registerTool } = await registerFlags(true);
    const result = await getExecute(registerTool, 'set_favorite')(
      { enabled: true, talk: 'https://evil.example/talks/john-doe/x' },
      { signal: new AbortController().signal }
    );

    expect(result).toHaveProperty('error');
    expect(mutate).not.toHaveBeenCalled();
  });
});
