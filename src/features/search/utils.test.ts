import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const {
  emptySiteSearch,
  getNextActiveIndex,
  getSearchInputAction,
  getSearchPageHref,
  groupSearchHits,
  hasSearchHits,
  toSearchHits,
} = await import('./utils.ts');

const result = {
  clips: [
    {
      _id: 'clip1',
      slug: 'sample-clip-no-condemnation',
      speaker: {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      },
      title: 'Sample Clip: No Condemnation',
    },
  ],
  speakers: [
    {
      _id: 'speaker1',
      firstName: 'John',
      lastName: 'Doe',
      ministry: 'Sample Chapel',
      slug: 'john-doe',
    },
  ],
  talks: [
    {
      _id: 'talk1',
      slug: 'sample-sermon-on-romans-8',
      speaker: {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      },
      title: 'Sample Sermon on Romans 8',
    },
    {
      _id: 'talk2',
      slug: 'missing-speaker',
      speaker: null,
      title: 'Orphan Talk',
    },
  ],
  topics: [
    {
      _id: 'topic1',
      slug: 'grace',
      title: 'Grace',
    },
  ],
};

describe('getSearchPageHref', () => {
  test('keeps the existing search query param', () => {
    assert.equal(getSearchPageHref('John Piper'), '/search?search=John+Piper');
  });
});

describe('toSearchHits', () => {
  test('maps published results to canonical links and skips talks without speakers', () => {
    assert.deepEqual(toSearchHits(result), [
      {
        href: '/talks/john-doe/sample-sermon-on-romans-8',
        id: 'talk1',
        subtitle: 'John Doe',
        title: 'Sample Sermon on Romans 8',
        type: 'talk',
      },
      {
        href: '/speakers/john-doe',
        id: 'speaker1',
        subtitle: 'Sample Chapel',
        title: 'John Doe',
        type: 'speaker',
      },
      {
        href: '/topics/grace',
        id: 'topic1',
        title: 'Grace',
        type: 'topic',
      },
      {
        href: '/clips/sample-clip-no-condemnation',
        id: 'clip1',
        subtitle: 'John Doe',
        title: 'Sample Clip: No Condemnation',
        type: 'clip',
      },
    ]);
  });
});

describe('groupSearchHits', () => {
  test('groups hits by type in nav order', () => {
    const groups = groupSearchHits(toSearchHits(result));

    assert.deepEqual(
      groups.map((group) => group.label),
      ['Talks', 'Speakers', 'Topics', 'Clips']
    );
    assert.equal(groups[2]?.hits[0]?.href, '/topics/grace');
  });
});

describe('hasSearchHits', () => {
  test('is false for an empty result', () => {
    assert.equal(hasSearchHits(emptySiteSearch), false);
  });

  test('is true when any type has a published hit', () => {
    assert.equal(hasSearchHits(result), true);
  });
});

describe('getNextActiveIndex', () => {
  test('wraps forward and backward through hits', () => {
    assert.equal(getNextActiveIndex(-1, 1, 3), 0);
    assert.equal(getNextActiveIndex(2, 1, 3), 0);
    assert.equal(getNextActiveIndex(0, -1, 3), 2);
  });

  test('stays empty when there are no hits', () => {
    assert.equal(getNextActiveIndex(0, 1, 0), -1);
  });
});

describe('getSearchInputAction', () => {
  test('maps keyboard keys used by the dropdown', () => {
    assert.equal(getSearchInputAction('ArrowDown', false), 'next');
    assert.equal(getSearchInputAction('ArrowUp', false), 'previous');
    assert.equal(getSearchInputAction('Enter', true), 'select');
    assert.equal(getSearchInputAction('Enter', false), null);
    assert.equal(getSearchInputAction('Escape', false), 'close');
  });
});
