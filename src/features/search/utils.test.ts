import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const {
  emptySiteSearch,
  getHeaderSearchQueryAfterClose,
  getHeaderSearchStatus,
  getSearchHotkeyLabel,
  getSearchPageHref,
  getSearchQuery,
  groupSearchHits,
  hasSearchHits,
  isSearchHotkey,
  toCommandGroups,
  toSearchHits,
  VIEW_ALL_SEARCH_GROUP,
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

describe('getHeaderSearchQueryAfterClose', () => {
  test('keeps the query on dismiss and clears after navigate', () => {
    assert.equal(getHeaderSearchQueryAfterClose('grace', false), 'grace');
    assert.equal(getHeaderSearchQueryAfterClose('grace', true), '');
  });
});

describe('getSearchQuery', () => {
  test('trims a string and uses the first repeated param', () => {
    assert.equal(getSearchQuery('  grace  '), 'grace');
    assert.equal(getSearchQuery(['grace', 'prayer']), 'grace');
    assert.equal(getSearchQuery(), '');
  });
});

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

describe('getHeaderSearchStatus', () => {
  test('returns idle, loading, empty, or results', () => {
    assert.equal(
      getHeaderSearchStatus({
        hasQuery: false,
        hasResults: false,
        isLoading: false,
      }),
      'idle'
    );
    assert.equal(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: false,
        isLoading: true,
      }),
      'loading'
    );
    assert.equal(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: false,
        isLoading: false,
      }),
      'empty'
    );
    assert.equal(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: true,
        isLoading: false,
      }),
      'results'
    );
  });
});

describe('getSearchHotkeyLabel', () => {
  test('shows the Apple glyph on Apple user agents', () => {
    assert.equal(
      getSearchHotkeyLabel(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      ),
      '⌘K'
    );
  });

  test('shows Ctrl K otherwise', () => {
    assert.equal(
      getSearchHotkeyLabel(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ),
      'Ctrl K'
    );
    assert.equal(getSearchHotkeyLabel(), 'Ctrl K');
  });
});

describe('toCommandGroups', () => {
  test('keeps group order and appends view all when there is a query', () => {
    const groups = toCommandGroups(toSearchHits(result), 'grace');

    assert.deepEqual(
      groups.map((group) => group.value),
      ['Talks', 'Speakers', 'Topics', 'Clips', VIEW_ALL_SEARCH_GROUP]
    );
    assert.equal(groups.at(-1)?.items[0]?.href, '/search?search=grace');
    assert.equal(groups.at(-1)?.items[0]?.label, 'View all results');
  });

  test('stays empty when there is no query', () => {
    assert.deepEqual(toCommandGroups([], ''), []);
  });
});

describe('isSearchHotkey', () => {
  const base = {
    altKey: false,
    ctrlKey: false,
    key: 'k',
    metaKey: false,
    shiftKey: false,
  };

  test('matches unmodified Cmd or Ctrl K', () => {
    assert.equal(isSearchHotkey({ ...base, metaKey: true }), true);
    assert.equal(isSearchHotkey({ ...base, ctrlKey: true }), true);
  });

  test('ignores other modifiers, keys, and repeats', () => {
    assert.equal(isSearchHotkey(base), false);
    assert.equal(isSearchHotkey({ ...base, key: 's', metaKey: true }), false);
    assert.equal(
      isSearchHotkey({ ...base, altKey: true, metaKey: true }),
      false
    );
    assert.equal(
      isSearchHotkey({ ...base, metaKey: true, shiftKey: true }),
      false
    );
    assert.equal(
      isSearchHotkey({ ...base, metaKey: true, repeat: true }),
      false
    );
  });
});
