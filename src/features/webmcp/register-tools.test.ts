import type { SiteSearchResult } from '@/features/search/types';
import type { WebMCP } from 'webmcp-types';

import {
  SEARCH_PAGE_LIMIT,
  buildSearchPageHref,
} from '@/features/search/utils';
import { describe, expect, it, vi } from '@/test';

import { registerDocumentWebMcpTools } from './register-tools';
import { WEBMCP_SEARCH_PAGE_SIZE } from './tools';

const origin = 'https://www.gettreadtalks.com';

const siteSearch: SiteSearchResult = {
  clips: [],
  speakers: [],
  talks: [
    {
      _id: 'talk1',
      scripture: 'Romans 8:28',
      slug: 'sample-sermon-on-romans-8',
      speaker: {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      },
      title: 'Sample Sermon on Romans 8',
    },
  ],
  topics: [],
};

function getRegisteredTools(
  registerTool: ReturnType<typeof vi.fn>
): WebMCP.ModelContextTool[] {
  return registerTool.mock.calls.map(
    ([tool]) => tool as WebMCP.ModelContextTool
  );
}

describe('registerDocumentWebMcpTools', () => {
  it('is a no-op when modelContext is missing', async () => {
    const navigate = vi.fn();
    const searchSite = vi.fn();

    await registerDocumentWebMcpTools({
      document: {},
      navigate,
      origin,
      searchSite,
      signal: new AbortController().signal,
    });

    expect(navigate).not.toHaveBeenCalled();
    expect(searchSite).not.toHaveBeenCalled();
  });

  it('registers search_talks and open_talk with the expected schemas', async () => {
    const registerTool = vi.fn(async () => {});
    const modelContext = { registerTool } as unknown as WebMCP.ModelContext;

    await registerDocumentWebMcpTools({
      document: { modelContext },
      navigate: vi.fn(),
      origin,
      searchSite: vi.fn(),
      signal: new AbortController().signal,
    });

    const tools = getRegisteredTools(registerTool);
    const searchTalks = tools.find((tool) => tool.name === 'search_talks');
    const openTalk = tools.find((tool) => tool.name === 'open_talk');
    const searchSchema = searchTalks?.inputSchema as {
      properties: { query: object };
      required: string[];
    };
    const openSchema = openTalk?.inputSchema as {
      properties: { talk: object };
      required: string[];
    };

    expect(registerTool).toHaveBeenCalledTimes(2);
    expect(searchTalks?.annotations).toEqual({ untrustedContentHint: true });
    expect(searchSchema.required).toEqual(['query']);
    expect(searchSchema.properties.query).toBeDefined();
    expect(openTalk?.annotations).toBeUndefined();
    expect(openSchema.required).toEqual(['talk']);
    expect(openSchema.properties.talk).toBeDefined();
  });

  it('returns talk results from the search helper and opens site search', async () => {
    const registerTool = vi.fn(async () => {});
    const modelContext = { registerTool } as unknown as WebMCP.ModelContext;
    const navigate = vi.fn();
    const searchSite = vi.fn().mockResolvedValue(siteSearch);

    await registerDocumentWebMcpTools({
      document: { modelContext },
      navigate,
      origin,
      searchSite,
      signal: new AbortController().signal,
    });

    const searchTalks = getRegisteredTools(registerTool).find(
      (tool) => tool.name === 'search_talks'
    );
    const result = await searchTalks?.execute(
      { query: 'Romans' },
      { signal: new AbortController().signal }
    );

    expect(navigate).toHaveBeenCalledWith(buildSearchPageHref('Romans'));
    expect(searchSite).toHaveBeenCalledWith({
      limit: SEARCH_PAGE_LIMIT,
      query: 'Romans',
    });
    expect(result).toEqual({
      page_size: WEBMCP_SEARCH_PAGE_SIZE,
      talks: [
        {
          scripture: 'Romans 8:28',
          speaker: 'John Doe',
          title: 'Sample Sermon on Romans 8',
          url: 'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8',
        },
      ],
      total_count: 1,
    });
  });
});
