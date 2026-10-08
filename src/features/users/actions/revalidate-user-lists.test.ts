import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const dir = import.meta.dirname;
const usersDir = path.join(dir, '..');

function readUsersFile(relativePath: string) {
  return readFileSync(path.join(usersDir, relativePath), 'utf-8');
}

test('account list queries and revalidate action share the same cache tags', () => {
  const action = readUsersFile('actions/revalidate-user-lists.ts');
  const favorites = readUsersFile('queries/get-user-favorites.ts');
  const finished = readUsersFile('queries/get-user-finished-talks.ts');

  assert.ok(favorites.includes("cacheTag('user-favorites')"));
  assert.ok(finished.includes("cacheTag('user-finished-talks')"));
  assert.ok(action.includes("updateTag('user-favorites')"));
  assert.ok(action.includes("updateTag('user-finished-talks')"));
  assert.ok(action.includes('refresh()'));
});

test('favorite and finish mutations invalidate the account list caches', () => {
  const mutationCallSites = [
    'components/unfavorite-buttons.tsx',
    'components/unfinish-talk-button.tsx',
    'hooks/use-toggle-speaker-favorited.ts',
    'hooks/use-toggle-talk-favorited.ts',
    'hooks/use-toggle-talk-finished.ts',
  ];

  for (const relativePath of mutationCallSites) {
    assert.ok(
      readUsersFile(relativePath).includes('revalidateUserLists'),
      `${relativePath} should invalidate user list caches after mutating`
    );
  }
});
