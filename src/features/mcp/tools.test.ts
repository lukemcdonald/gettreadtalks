import type { McpCatalog } from './tools';

import { describe, expect, it } from '@/test';

import {
  createTreadMcpHandler,
  getClip,
  getCollection,
  getTalk,
  listClips,
  listCollections,
  listSpeakers,
  listTopics,
  searchTalks,
} from './tools';

const john = {
  firstName: 'John',
  lastName: 'Doe',
  ministry: 'Sample Chapel',
  slug: 'john-doe',
};

const graceTopic = {
  slug: 'grace',
  title: 'Grace',
};

const romansTalk = {
  description: 'A sample sermon on Romans 8.',
  publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
  scripture: 'Romans 8:28',
  slug: 'sample-sermon-on-romans-8',
  speaker: john,
  title: 'Sample Sermon on Romans 8',
  topicSlugs: ['grace'],
};

const psalmsTalk = {
  description: 'A sample talk on Psalm 23.',
  publishedAt: Date.parse('2024-06-02T12:00:00.000Z'),
  scripture: 'Psalm 23:1-3',
  slug: 'sample-talk-the-lord-is-my-shepherd',
  speaker: john,
  title: 'Sample Talk: The Lord Is My Shepherd',
  topicSlugs: ['prayer'],
};

const psalmsCollection = {
  description: 'An example series.',
  slug: 'example-series-the-psalms',
  title: 'Example Series: The Psalms',
};

const noCondemnationClip = {
  description: 'A clip from Romans 8.',
  publishedAt: Date.parse('2024-06-03T12:30:00.000Z'),
  slug: 'sample-clip-no-condemnation',
  speaker: john,
  title: 'Sample Clip: No Condemnation',
};

function parseToolJson(result: {
  content: { text: string; type: string }[];
  isError?: boolean;
}) {
  const [part] = result.content;
  if (!part) {
    throw new Error('expected tool content');
  }

  return JSON.parse(part.text) as Record<string, unknown>;
}

function createCatalog(overrides: Partial<McpCatalog> = {}): McpCatalog {
  const publishedTalks = [romansTalk, psalmsTalk];

  return {
    getClipBySlug: (slug) => {
      if (slug !== noCondemnationClip.slug) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        clip: noCondemnationClip,
        speaker: john,
        talk: {
          slug: romansTalk.slug,
          status: 'published',
          title: romansTalk.title,
        },
      });
    },
    getClips: ({ search, speakerSlugs } = {}) => {
      let clips = [noCondemnationClip];

      if (search) {
        clips = clips.filter((clip) =>
          clip.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (speakerSlugs?.length) {
        clips = clips.filter((clip) =>
          speakerSlugs.includes(clip.speaker.slug)
        );
      }

      return Promise.resolve({
        clips,
        continueCursor: '',
        isDone: true,
      });
    },
    getCollectionBySlug: (slug) => {
      if (slug !== psalmsCollection.slug) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        collection: psalmsCollection,
        talks: [psalmsTalk],
      });
    },
    getCollections: () =>
      Promise.resolve({
        collections: [
          {
            collection: psalmsCollection,
            speakers: [john],
            talkCount: 1,
          },
        ],
      }),
    getSpeakers: ({ search } = {}) => {
      const speakers = search
        ? [john].filter((speaker) =>
            `${speaker.firstName} ${speaker.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        : [john];

      return Promise.resolve({ speakers });
    },
    getTalkBySlug: (speakerSlug, talkSlug) => {
      const talk = publishedTalks.find(
        (item) => item.speaker.slug === speakerSlug && item.slug === talkSlug
      );

      if (!talk) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        clips: talk.slug === romansTalk.slug ? [noCondemnationClip] : [],
        collection: talk.slug === psalmsTalk.slug ? psalmsCollection : null,
        speaker: talk.speaker,
        talk,
        topics: talk.topicSlugs.includes('grace') ? [graceTopic] : [],
      });
    },
    getTalks: ({ search, speakerSlugs, topicSlugs } = {}) => {
      let talks = publishedTalks;

      if (search) {
        talks = talks.filter((talk) =>
          talk.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (speakerSlugs?.length) {
        talks = talks.filter((talk) =>
          speakerSlugs.includes(talk.speaker.slug)
        );
      }

      if (topicSlugs?.length) {
        talks = talks.filter((talk) =>
          talk.topicSlugs.some((slug) => topicSlugs.includes(slug))
        );
      }

      return Promise.resolve({
        continueCursor: '',
        isDone: true,
        talks,
      });
    },
    getTopicsWithCounts: ({ search } = {}) => {
      const topics = [{ count: 2, topic: graceTopic }];

      if (!search) {
        return Promise.resolve(topics);
      }

      return Promise.resolve(
        topics.filter(({ topic }) =>
          topic.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    },
    ...overrides,
  };
}

describe('searchTalks', () => {
  it('returns canonical talk urls for published talks', async () => {
    const result = await searchTalks({ query: 'Romans' }, createCatalog());
    const body = parseToolJson(result);
    const talks = body.talks as { title: string; url: string }[];

    expect(result.isError).toBe(false);
    expect(talks.length).toBe(1);
    expect(talks[0]?.title).toBe('Sample Sermon on Romans 8');
    expect(talks[0]?.url).toBe(
      'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8'
    );
  });

  it('filters published talks by speaker and topic slugs', async () => {
    const result = await searchTalks(
      { speaker: 'john-doe', topic: 'grace' },
      createCatalog()
    );
    const body = parseToolJson(result);
    const talks = body.talks as { slug: string }[];

    expect(talks.map((talk) => talk.slug)).toEqual([
      'sample-sermon-on-romans-8',
    ]);
  });
});

describe('getTalk', () => {
  it('returns the talk with canonical urls', async () => {
    const result = await getTalk(
      {
        speakerSlug: 'john-doe',
        talkSlug: 'sample-sermon-on-romans-8',
      },
      createCatalog()
    );
    const body = parseToolJson(result);
    const talk = body.talk as { url: string };
    const speaker = body.speaker as { url: string };
    const clips = body.clips as { url: string }[];

    expect(result.isError).toBe(false);
    expect(talk.url).toBe(
      'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8'
    );
    expect(speaker.url).toBe('https://www.gettreadtalks.com/speakers/john-doe');
    expect(clips[0]?.url).toBe(
      'https://www.gettreadtalks.com/clips/sample-clip-no-condemnation'
    );
  });

  it('returns not found for missing or unpublished talks', async () => {
    const result = await getTalk(
      { speakerSlug: 'john-doe', talkSlug: 'draft-talk' },
      createCatalog()
    );
    const body = parseToolJson(result);

    expect(result.isError).toBe(true);
    expect(body.error).toBe('Talk not found.');
  });
});

describe('listSpeakers', () => {
  it('returns canonical speaker urls', async () => {
    const result = await listSpeakers({}, createCatalog());
    const body = parseToolJson(result);
    const speakers = body.speakers as { name: string; url: string }[];

    expect(speakers[0]?.name).toBe('John Doe');
    expect(speakers[0]?.url).toBe(
      'https://www.gettreadtalks.com/speakers/john-doe'
    );
  });
});

describe('listTopics', () => {
  it('returns canonical topic urls and talk counts', async () => {
    const result = await listTopics({}, createCatalog());
    const body = parseToolJson(result);
    const topics = body.topics as {
      talkCount: number;
      title: string;
      url: string;
    }[];

    expect(topics[0]?.title).toBe('Grace');
    expect(topics[0]?.talkCount).toBe(2);
    expect(topics[0]?.url).toBe('https://www.gettreadtalks.com/topics/grace');
  });
});

describe('listCollections', () => {
  it('returns canonical collection urls', async () => {
    const result = await listCollections({}, createCatalog());
    const body = parseToolJson(result);
    const collections = body.collections as {
      talkCount: number;
      url: string;
    }[];

    expect(collections[0]?.talkCount).toBe(1);
    expect(collections[0]?.url).toBe(
      'https://www.gettreadtalks.com/collections/example-series-the-psalms'
    );
  });
});

describe('getCollection', () => {
  it('returns the collection talks with canonical urls', async () => {
    const result = await getCollection(
      { slug: 'example-series-the-psalms' },
      createCatalog()
    );
    const body = parseToolJson(result);
    const talks = body.talks as { url: string }[];

    expect(result.isError).toBe(false);
    expect(talks[0]?.url).toBe(
      'https://www.gettreadtalks.com/talks/john-doe/sample-talk-the-lord-is-my-shepherd'
    );
  });

  it('returns not found for an unknown collection', async () => {
    const result = await getCollection({ slug: 'missing' }, createCatalog());
    const body = parseToolJson(result);

    expect(result.isError).toBe(true);
    expect(body.error).toBe('Collection not found.');
  });

  it('returns not found when a collection has no published talks', async () => {
    const result = await getCollection(
      { slug: 'empty-series' },
      createCatalog({
        getCollectionBySlug: (slug) => {
          if (slug !== 'empty-series') {
            return Promise.resolve(null);
          }

          return Promise.resolve({
            collection: {
              slug: 'empty-series',
              title: 'Empty Series',
            },
            talks: [],
          });
        },
      })
    );
    const body = parseToolJson(result);

    expect(result.isError).toBe(true);
    expect(body.error).toBe('Collection not found.');
  });
});

describe('listClips', () => {
  it('returns canonical clip urls', async () => {
    const result = await listClips({ query: 'condemnation' }, createCatalog());
    const body = parseToolJson(result);
    const clips = body.clips as { title: string; url: string }[];

    expect(clips.length).toBe(1);
    expect(clips[0]?.title).toBe('Sample Clip: No Condemnation');
    expect(clips[0]?.url).toBe(
      'https://www.gettreadtalks.com/clips/sample-clip-no-condemnation'
    );
  });
});

describe('getClip', () => {
  it('returns the clip with canonical urls', async () => {
    const result = await getClip(
      { slug: 'sample-clip-no-condemnation' },
      createCatalog()
    );
    const body = parseToolJson(result);
    const clip = body.clip as { url: string };
    const talk = body.talk as { url: string };

    expect(result.isError).toBe(false);
    expect(clip.url).toBe(
      'https://www.gettreadtalks.com/clips/sample-clip-no-condemnation'
    );
    expect(talk.url).toBe(
      'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8'
    );
  });

  it('returns not found for a missing clip', async () => {
    const result = await getClip({ slug: 'missing' }, createCatalog());
    const body = parseToolJson(result);

    expect(result.isError).toBe(true);
    expect(body.error).toBe('Clip not found.');
  });

  it('returns not found when the parent talk is unpublished', async () => {
    const result = await getClip(
      { slug: 'draft-parent-clip' },
      createCatalog({
        getClipBySlug: (slug) => {
          if (slug !== 'draft-parent-clip') {
            return Promise.resolve(null);
          }

          return Promise.resolve({
            clip: {
              slug: 'draft-parent-clip',
              title: 'Clip on a draft talk',
            },
            speaker: john,
            talk: {
              slug: 'draft-talk',
              status: 'draft',
              title: 'Draft Talk',
            },
          });
        },
      })
    );
    const body = parseToolJson(result);

    expect(result.isError).toBe(true);
    expect(body.error).toBe('Clip not found.');
  });
});

async function postMcp(
  handler: (request: Request) => Promise<Response>,
  method: string,
  params: Record<string, unknown>,
  id = 1
) {
  return await handler(
    new Request('https://www.gettreadtalks.com/mcp', {
      body: JSON.stringify({
        id,
        jsonrpc: '2.0',
        method,
        params,
      }),
      headers: {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  );
}

describe('createTreadMcpHandler', () => {
  it('initialize names the public catalog', async () => {
    const handler = createTreadMcpHandler(createCatalog());
    const response = await postMcp(handler, 'initialize', {
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' },
      protocolVersion: '2025-11-25',
    });
    const body = await response.text();

    expect(response.ok).toBe(true);
    expect(body.includes('gettreadtalks')).toBe(true);
  });

  it('lists the read-only catalog tools', async () => {
    const handler = createTreadMcpHandler(createCatalog());
    await postMcp(handler, 'initialize', {
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' },
      protocolVersion: '2025-11-25',
    });
    await postMcp(handler, 'notifications/initialized', {});
    const response = await postMcp(handler, 'tools/list', {}, 2);
    const body = await response.text();

    expect(response.ok).toBe(true);
    expect(body.includes('search_talks')).toBe(true);
    expect(body.includes('get_talk')).toBe(true);
    expect(body.includes('list_speakers')).toBe(true);
    expect(body.includes('list_topics')).toBe(true);
    expect(body.includes('list_collections')).toBe(true);
    expect(body.includes('get_collection')).toBe(true);
    expect(body.includes('list_clips')).toBe(true);
    expect(body.includes('get_clip')).toBe(true);
  });

  it('rejects an oversized search query', async () => {
    const handler = createTreadMcpHandler(createCatalog());
    await postMcp(handler, 'initialize', {
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' },
      protocolVersion: '2025-11-25',
    });
    await postMcp(handler, 'notifications/initialized', {});
    const response = await postMcp(
      handler,
      'tools/call',
      {
        arguments: { query: 'x'.repeat(201) },
        name: 'search_talks',
      },
      2
    );
    const body = await response.text();

    expect(response.ok).toBe(true);
    expect(body.includes('Sample Sermon on Romans 8')).toBe(false);
    expect(
      body.includes('Too big: expected string to have <=200 characters')
    ).toBe(true);
  });
});
