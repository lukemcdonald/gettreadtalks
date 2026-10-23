import { buildSearchPageHref } from '@/features/search/utils';
import {
  describe,
  expect,
  expectTracked,
  expectTrackedTimes,
  it,
  mockedTrack,
  vi,
} from '@/test';

import { registerWebMcpTools } from './tools';

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
            input: Record<string, string>,
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

  it('tracks one event per tool call without query text', async () => {
    const query = 'Romans 8 unique-query';
    const registerTool = vi.fn(async () => {});
    const searchTalks = vi
      .fn()
      .mockResolvedValueOnce({ talks: [romansTalk] })
      .mockRejectedValueOnce(new Error('backend down'));
    const { signal } = new AbortController();

    await registerWebMcpTools({
      document: { modelContext: { registerTool } },
      navigate: vi.fn(),
      origin,
      searchTalks,
      signal: new AbortController().signal,
    });

    const openTalk = getExecute(registerTool, 'open_talk');
    const searchTalksTool = getExecute(registerTool, 'search_talks');

    await searchTalksTool({ query }, { signal });

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      result_count: 1,
      status: 'ok',
      tool_name: 'search_talks',
    });
    expect(JSON.stringify(mockedTrack().mock.calls)).not.toContain(query);

    mockedTrack().mockClear();
    await searchTalksTool({ query }, { signal });

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      status: 'error',
      tool_name: 'search_talks',
    });
    expect(JSON.stringify(mockedTrack().mock.calls)).not.toContain(query);

    mockedTrack().mockClear();
    await openTalk(
      {
        talk: 'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8',
      },
      { signal }
    );

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      status: 'ok',
      talk_slug: 'sample-sermon-on-romans-8',
      tool_name: 'open_talk',
    });

    mockedTrack().mockClear();
    const typedTalk = '/manage/talks?q=user-typed-secret';
    await openTalk({ talk: typedTalk }, { signal });

    expectTrackedTimes(1);
    expectTracked('webmcp_tool_called', {
      status: 'error',
      tool_name: 'open_talk',
    });
    expect(JSON.stringify(mockedTrack().mock.calls)).not.toContain(typedTalk);
  });
});
