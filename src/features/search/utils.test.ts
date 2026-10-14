import { describe, expect, test } from 'vitest';

import {
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
} from './utils';

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
    expect(getHeaderSearchQueryAfterClose('grace', false)).toBe('grace');
    expect(getHeaderSearchQueryAfterClose('grace', true)).toBe('');
  });
});

describe('getSearchQuery', () => {
  test('trims a string and uses the first repeated param', () => {
    expect(getSearchQuery('  grace  ')).toBe('grace');
    expect(getSearchQuery(['grace', 'prayer'])).toBe('grace');
    expect(getSearchQuery()).toBe('');
  });
});

describe('getSearchPageHref', () => {
  test('keeps the existing search query param', () => {
    expect(getSearchPageHref('John Piper')).toBe('/search?search=John+Piper');
  });
});

describe('toSearchHits', () => {
  test('maps published results to canonical links and skips talks without speakers', () => {
    expect(toSearchHits(result)).toEqual([
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

    expect(groups.map((group) => group.label)).toEqual([
      'Talks',
      'Speakers',
      'Topics',
      'Clips',
    ]);
    expect(groups[2]?.hits[0]?.href).toBe('/topics/grace');
  });
});

describe('hasSearchHits', () => {
  test('is false for an empty result', () => {
    expect(hasSearchHits(emptySiteSearch)).toBe(false);
  });

  test('is true when any type has a published hit', () => {
    expect(hasSearchHits(result)).toBe(true);
  });
});

describe('getHeaderSearchStatus', () => {
  test('returns idle, loading, empty, or results', () => {
    expect(
      getHeaderSearchStatus({
        hasQuery: false,
        hasResults: false,
        isLoading: false,
      })
    ).toBe('idle');
    expect(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: false,
        isLoading: true,
      })
    ).toBe('loading');
    expect(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: false,
        isLoading: false,
      })
    ).toBe('empty');
    expect(
      getHeaderSearchStatus({
        hasQuery: true,
        hasResults: true,
        isLoading: false,
      })
    ).toBe('results');
  });
});

describe('getSearchHotkeyLabel', () => {
  test('shows the Apple glyph on Apple user agents', () => {
    expect(
      getSearchHotkeyLabel(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      )
    ).toBe('⌘K');
  });

  test('shows Ctrl K otherwise', () => {
    expect(
      getSearchHotkeyLabel(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      )
    ).toBe('Ctrl K');
    expect(getSearchHotkeyLabel()).toBe('Ctrl K');
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

    expect(idle.status).toBe('idle');
    expect(idle.groups[0]?.value).toBe(BROWSE_SEARCH_GROUP);
    expect(firstLoad.status).toBe('loading');
    expect(firstLoad.groups[0]?.value).toBe(BROWSE_SEARCH_GROUP);
    expect(results.status).toBe('results');
    expect(results.groups.at(-1)?.value).not.toBe(VIEW_ALL_SEARCH_GROUP);
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

    expect(results.groups.at(-1)?.value).toBe(VIEW_ALL_SEARCH_GROUP);
  });

  test('keeps previous hits while refining and hides view all until settled', () => {
    const pending = getHeaderSearchState({
      hits: [],
      isPending: true,
      isSignedIn: false,
      previousHits: hits,
      value: 'grace hopper',
    });

    expect(pending.status).toBe('loading');
    expect(pending.groups.map((group) => group.value)).toEqual([
      'Talks',
      'Speakers',
      'Topics',
      'Clips',
    ]);
  });

  test('keeps the empty state while a later query loads', () => {
    const pendingEmpty = getHeaderSearchState({
      hits: [],
      isPending: true,
      isSignedIn: false,
      previousHits: [],
      value: 'zzzz',
    });

    expect(pendingEmpty.status).toBe('empty');
    expect(pendingEmpty.groups).toEqual([]);
  });
});

describe('getBrowseCommandGroups', () => {
  test('lists browse destinations and favorites when signed in', () => {
    const signedOut = getBrowseCommandGroups(false);

    expect(signedOut[0]?.value).toBe(BROWSE_SEARCH_GROUP);
    expect(signedOut[0]?.items.map((item) => item.label)).toEqual([
      'Talks',
      'Speakers',
      'Topics',
      'Collections',
      'Clips',
    ]);
    expect(
      getBrowseCommandGroups(true)[0]?.items.map((item) => item.href)
    ).toEqual([
      '/talks',
      '/speakers',
      '/topics',
      '/collections',
      '/clips',
      '/account/favorites',
    ]);
  });
});

describe('shouldShowViewAllResults', () => {
  test('is false until a type reaches the fetch limit', () => {
    expect(shouldShowViewAllResults(toSearchHits(result))).toBe(false);
    expect(shouldShowViewAllResults(cappedTalkHits())).toBe(true);
  });
});

describe('getSearchSelectionAnalytics', () => {
  const hits = toSearchHits(result);

  test('returns null for browse and unknown items', () => {
    expect(
      getSearchSelectionAnalytics({
        hits,
        itemValue: hits[0]?.id ?? '',
        query: '',
      })
    ).toBe(null);
    expect(
      getSearchSelectionAnalytics({
        hits,
        itemValue: 'missing',
        query: 'grace',
      })
    ).toBe(null);
  });

  test('uses a 1-based position and view_all after the last hit', () => {
    expect(
      getSearchSelectionAnalytics({
        hits,
        itemValue: hits[2]?.id ?? '',
        query: '  grace  ',
      })
    ).toEqual({
      position: 3,
      query: 'grace',
      result_type: 'topic',
    });
    expect(
      getSearchSelectionAnalytics({
        hits,
        itemValue: VIEW_ALL_SEARCH_GROUP,
        query: 'grace',
      })
    ).toEqual({
      position: hits.length + 1,
      query: 'grace',
      result_type: 'view_all',
    });
  });
});

describe('toCommandGroups', () => {
  test('keeps group order and omits view all when every group is visible', () => {
    const groups = toCommandGroups(toSearchHits(result), 'grace');

    expect(groups.map((group) => group.value)).toEqual([
      'Talks',
      'Speakers',
      'Topics',
      'Clips',
    ]);
  });

  test('appends view all when a type hits the dropdown limit', () => {
    const groups = toCommandGroups(cappedTalkHits(), 'talk');

    expect(groups.at(-1)?.value).toBe(VIEW_ALL_SEARCH_GROUP);
    expect(groups.at(-1)?.items[0]?.href).toBe('/search?search=talk');
    expect(groups.at(-1)?.items[0]?.label).toBe('View all results');
  });

  test('stays empty when there is no query', () => {
    expect(toCommandGroups([], '')).toEqual([]);
  });

  test('omits view all when the query has no hits', () => {
    expect(toCommandGroups([], 'zzzz')).toEqual([]);
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
    expect(isSearchHotkey({ ...base, metaKey: true })).toBe(true);
    expect(isSearchHotkey({ ...base, ctrlKey: true })).toBe(true);
  });

  test('ignores other modifiers, keys, and repeats', () => {
    expect(isSearchHotkey(base)).toBe(false);
    expect(isSearchHotkey({ ...base, key: 's', metaKey: true })).toBe(false);
    expect(isSearchHotkey({ ...base, altKey: true, metaKey: true })).toBe(
      false
    );
    expect(isSearchHotkey({ ...base, metaKey: true, shiftKey: true })).toBe(
      false
    );
    expect(isSearchHotkey({ ...base, metaKey: true, repeat: true })).toBe(
      false
    );
  });
});
