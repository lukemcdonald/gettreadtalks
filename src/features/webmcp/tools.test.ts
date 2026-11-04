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

const formattedRomansTalk = {
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
};

const publishedTalk = {
  speaker: john,
  talk: {
    _id: 'talks:romans' as Id<'talks'>,
    publishedAt: romansTalk.publishedAt,
    scripture: romansTalk.scripture,
    slug: romansTalk.slug,
    title: romansTalk.title,
  },
  topics: [{ slug: 'grace' }],
};

type FunctionRef = Parameters<typeof getFunctionName>[0];

function createTalkClients({
  favorited = false,
  finished = false,
  talk = publishedTalk,
}: {
  favorited?: boolean;
  finished?: boolean;
  talk?: typeof publishedTalk | null;
} = {}) {
  const query = vi.fn((reference: FunctionRef) => {
    const name = getFunctionName(reference);

    if (name === 'talks:getTalkBySlug') {
      return talk;
    }

    if (name === 'users:isTalkFavorited') {
      return favorited;
    }

    if (name === 'users:isTalkFinished') {
      return finished;
    }

    throw new Error(name);
  });
  const refreshGate = Promise.withResolvers<null>();
  const refreshLists = vi.fn(async () => {
    await refreshGate.promise;
  });
  const mutate = vi.fn(
    (_reference: FunctionRef, _args: { talkId: Id<'talks'> }) => null
  );

  return {
    finishRefresh: () => {
      refreshGate.resolve(null);
    },
    mutate,
    query,
    refreshLists,
  };
}

async function registerTalkFlags(
  clients: ReturnType<typeof createTalkClients>
) {
  const registerTool = vi.fn((_tool: { annotations?: object; name: string }) =>
    Promise.resolve()
  );
  await registerSignedInWebMcpTools({
    document: { modelContext: { registerTool } },
    mutate: clients.mutate as unknown as ConvexReactClient['mutation'],
    origin,
    query: clients.query as unknown as ConvexReactClient['query'],
    refreshLists: clients.refreshLists,
    signal: new AbortController().signal,
  });

  return registerTool;
}

describe('registerSignedInWebMcpTools', () => {
  it('set_favorite saves a talk and waits for the page to refresh', async () => {
    const clients = createTalkClients();
    const registerTool = await registerTalkFlags(clients);
    const tool = registerTool.mock.calls
      .map(
        ([registered]) => registered as { annotations?: object; name: string }
      )
      .find((registered) => registered.name === 'set_favorite');

    expect(tool?.annotations).toEqual({ untrustedContentHint: true });

    const pending = getExecute(registerTool, 'set_favorite')(
      {
        enabled: true,
        talk: formattedRomansTalk.url,
      },
      { signal: new AbortController().signal }
    );
    let settled = false;

    void pending.then(() => {
      settled = true;
      return null;
    });

    await vi.waitFor(() => {
      expect(clients.refreshLists).toHaveBeenCalledTimes(1);
    });
    await Promise.resolve();

    expect(settled).toBe(false);
    expect(clients.mutate).toHaveBeenCalledTimes(1);
    expect(getFunctionName(clients.mutate.mock.calls[0][0])).toBe(
      'users:favoriteTalk'
    );
    expect(clients.mutate.mock.calls[0][1]).toEqual({
      talkId: publishedTalk.talk._id,
    });

    clients.finishRefresh();

    await expect(pending).resolves.toEqual({
      enabled: true,
      talk: formattedRomansTalk,
    });
  });

  it('set_favorite removes a saved talk', async () => {
    const clients = createTalkClients({ favorited: true });
    const registerTool = await registerTalkFlags(clients);

    const pending = getExecute(registerTool, 'set_favorite')(
      { enabled: false, talk: formattedRomansTalk.url },
      { signal: new AbortController().signal }
    );

    await vi.waitFor(() => {
      expect(clients.refreshLists).toHaveBeenCalledTimes(1);
    });
    clients.finishRefresh();

    await expect(pending).resolves.toEqual({
      enabled: false,
      talk: formattedRomansTalk,
    });
    expect(getFunctionName(clients.mutate.mock.calls[0]?.[0])).toBe(
      'users:unfavoriteTalk'
    );
  });

  it('leaves a talk alone when it is already in the requested state', async () => {
    const clients = createTalkClients({ favorited: true });
    const registerTool = await registerTalkFlags(clients);

    await expect(
      getExecute(registerTool, 'set_favorite')(
        { enabled: true, talk: '/talks/john-doe/sample-sermon-on-romans-8' },
        { signal: new AbortController().signal }
      )
    ).resolves.toEqual({
      enabled: true,
      talk: formattedRomansTalk,
    });
    expect(clients.mutate).not.toHaveBeenCalled();
    expect(clients.refreshLists).not.toHaveBeenCalled();
  });

  it.each([
    {
      code: 'CROSS_ORIGIN',
      talk: 'https://evil.example/talks/john-doe/x',
    },
    {
      code: 'NOT_FOUND',
      talk: formattedRomansTalk.url,
      unknown: true,
    },
  ])('set_favorite reports $code', async ({ code, talk, unknown }) => {
    const clients = createTalkClients({ talk: unknown ? null : publishedTalk });
    const registerTool = await registerTalkFlags(clients);
    const result = await getExecute(registerTool, 'set_favorite')(
      { enabled: true, talk },
      { signal: new AbortController().signal }
    );

    expect(result).toEqual(
      expect.objectContaining({
        code,
      })
    );
    expect(clients.mutate).not.toHaveBeenCalled();
    expect(clients.refreshLists).not.toHaveBeenCalled();
  });

  it('set_finished marks a talk finished', async () => {
    const clients = createTalkClients();
    const registerTool = await registerTalkFlags(clients);
    const pending = getExecute(registerTool, 'set_finished')(
      { enabled: true, talk: formattedRomansTalk.url },
      { signal: new AbortController().signal }
    );

    await vi.waitFor(() => {
      expect(clients.refreshLists).toHaveBeenCalledTimes(1);
    });
    clients.finishRefresh();

    await expect(pending).resolves.toEqual({
      enabled: true,
      talk: formattedRomansTalk,
    });
    expect(getFunctionName(clients.mutate.mock.calls[0]?.[0])).toBe(
      'users:finishTalk'
    );
  });

  it('returns a retryable error when the update fails', async () => {
    const clients = createTalkClients();
    clients.mutate.mockRejectedValueOnce(new Error('backend down'));
    const registerTool = await registerTalkFlags(clients);
    const result = await getExecute(registerTool, 'set_favorite')(
      { enabled: true, talk: formattedRomansTalk.url },
      { signal: new AbortController().signal }
    );

    expect(result).toEqual({
      code: 'UPDATE_FAILED',
      error: 'Could not update that talk. Try again in a moment.',
      retryable: true,
    });
    expect(JSON.stringify(result)).not.toContain('backend down');
    expect(clients.refreshLists).not.toHaveBeenCalled();
  });
});
