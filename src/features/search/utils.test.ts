import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const {
  BROWSE_SEARCH_GROUP,
  emptySiteSearch,
  getBrowseCommandGroups,
  getHeaderSearchQueryAfterClose,
  getHeaderSearchState,
  getHeaderSearchStatus,
  getSearchHotkeyLabel,
  getSearchPageHref,
  getSearchQuery,
  getSearchSelectionAnalytics,
  groupSearchHits,
  hasSearchHits,
  isSearchHotkey,
  SEARCH_DROPDOWN_LIMIT,
  shouldShowViewAllResults,
  toCommandGroups,
  toSearchHits,
  VIEW_ALL_SEARCH_GROUP,
} = await import('./utils.ts');

function cappedTalkHits() {
  return Array.from({ length: SEARCH_DROPDOWN_LIMIT }, (_, index) => ({
    href: `/talks/john-doe/talk-${index}`,
    id: `talk${index}`,
    title: `Talk ${index}`,
    type: 'talk' as const,
  }));
}

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

describe('getHeaderSearchState', () => {
  const hits = toSearchHits(result);

  test('keeps browse while the first query loads and hides view all when every group is visible', () => {
    const idle = getHeaderSearchState({
      hits,
      isPending: false,
      isSignedIn: false,
      previousHits: null,
      value: '',
    });
    const firstLoad = getHeaderSearchState({
      hits: [],
      isPending: true,
      isSignedIn: false,
      previousHits: null,
      value: 'grace',
    });
    const results = getHeaderSearchState({
      hits,
      isPending: false,
      isSignedIn: false,
      previousHits: hits,
      value: 'grace',
    });

    assert.equal(idle.status, 'idle');
    assert.equal(idle.groups[0]?.value, BROWSE_SEARCH_GROUP);
    assert.equal(firstLoad.status, 'loading');
    assert.equal(firstLoad.groups[0]?.value, BROWSE_SEARCH_GROUP);
    assert.equal(results.status, 'results');
    assert.notEqual(results.groups.at(-1)?.value, VIEW_ALL_SEARCH_GROUP);
  });

  test('appends view all when a type hits the dropdown limit', () => {
    const cappedHits = cappedTalkHits();
    const results = getHeaderSearchState({
      hits: cappedHits,
      isPending: false,
      isSignedIn: false,
      previousHits: cappedHits,
      value: 'talk',
    });

    assert.equal(results.groups.at(-1)?.value, VIEW_ALL_SEARCH_GROUP);
  });

  test('keeps previous hits while refining and hides view all until settled', () => {
    const pending = getHeaderSearchState({
      hits: [],
      isPending: true,
      isSignedIn: false,
      previousHits: hits,
      value: 'grace hopper',
    });

    assert.equal(pending.status, 'loading');
    assert.deepEqual(
      pending.groups.map((group) => group.value),
      ['Talks', 'Speakers', 'Topics', 'Clips']
    );
  });

  test('keeps the empty state while a later query loads', () => {
    const pendingEmpty = getHeaderSearchState({
      hits: [],
      isPending: true,
      isSignedIn: false,
      previousHits: [],
      value: 'zzzz',
    });

    assert.equal(pendingEmpty.status, 'empty');
    assert.deepEqual(pendingEmpty.groups, []);
  });
});

describe('getBrowseCommandGroups', () => {
  test('lists browse destinations and favorites when signed in', () => {
    const signedOut = getBrowseCommandGroups(false);

    assert.equal(signedOut[0]?.value, BROWSE_SEARCH_GROUP);
    assert.deepEqual(
      signedOut[0]?.items.map((item) => item.label),
      ['Talks', 'Speakers', 'Topics', 'Collections', 'Clips']
    );
    assert.deepEqual(
      getBrowseCommandGroups(true)[0]?.items.map((item) => item.href),
      [
        '/talks',
        '/speakers',
        '/topics',
        '/collections',
        '/clips',
        '/account/favorites',
      ]
    );
  });
});

describe('shouldShowViewAllResults', () => {
  test('is false until a type reaches the fetch limit', () => {
    assert.equal(shouldShowViewAllResults(toSearchHits(result)), false);
    assert.equal(shouldShowViewAllResults(cappedTalkHits()), true);
  });
});

describe('getSearchSelectionAnalytics', () => {
  const hits = toSearchHits(result);

  test('returns null for browse and unknown items', () => {
    assert.equal(
      getSearchSelectionAnalytics({
        hits,
        itemValue: hits[0]?.id ?? '',
        query: '',
      }),
      null
    );
    assert.equal(
      getSearchSelectionAnalytics({
        hits,
        itemValue: 'missing',
        query: 'grace',
      }),
      null
    );
  });

  test('uses a 1-based position and view_all after the last hit', () => {
    assert.deepEqual(
      getSearchSelectionAnalytics({
        hits,
        itemValue: hits[2]?.id ?? '',
        query: '  grace  ',
      }),
      {
        position: 3,
        query: 'grace',
        result_type: 'topic',
      }
    );
    assert.deepEqual(
      getSearchSelectionAnalytics({
        hits,
        itemValue: VIEW_ALL_SEARCH_GROUP,
        query: 'grace',
      }),
      {
        position: hits.length + 1,
        query: 'grace',
        result_type: 'view_all',
      }
    );
  });
});

describe('toCommandGroups', () => {
  test('keeps group order and omits view all when every group is visible', () => {
    const groups = toCommandGroups(toSearchHits(result), 'grace');

    assert.deepEqual(
      groups.map((group) => group.value),
      ['Talks', 'Speakers', 'Topics', 'Clips']
    );
  });

  test('appends view all when a type hits the dropdown limit', () => {
    const groups = toCommandGroups(cappedTalkHits(), 'talk');

    assert.equal(groups.at(-1)?.value, VIEW_ALL_SEARCH_GROUP);
    assert.equal(groups.at(-1)?.items[0]?.href, '/search?search=talk');
    assert.equal(groups.at(-1)?.items[0]?.label, 'View all results');
  });

  test('stays empty when there is no query', () => {
    assert.deepEqual(toCommandGroups([], ''), []);
  });

  test('omits view all when the query has no hits', () => {
    assert.deepEqual(toCommandGroups([], 'zzzz'), []);
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
