import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const {
  emptySiteSearch,
  getNextActiveIndex,
  getSearchHotkeyLabel,
  getSearchInputAction,
  getSearchPageHref,
  getSearchQuery,
  groupSearchHits,
  hasSearchHits,
  isSearchHotkey,
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

describe('getSearchInputAction', () => {
  test('maps keyboard keys used by the dropdown', () => {
    assert.equal(getSearchInputAction('ArrowDown', false), 'next');
    assert.equal(getSearchInputAction('ArrowUp', false), 'previous');
    assert.equal(getSearchInputAction('Enter', true), 'select');
    assert.equal(getSearchInputAction('Enter', false), null);
    assert.equal(getSearchInputAction('Escape', false), 'close');
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
