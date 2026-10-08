import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ADMIN_LIST_PATHS,
  getAdminListPath,
  getAdminLoginRedirect,
  getEntityEditPath,
  getEntityNewPath,
} from './paths.ts';

test('admin list paths stay on the account admin pages', () => {
  assert.equal(getAdminListPath('talks'), '/account/talks');
  assert.equal(ADMIN_LIST_PATHS.clips, '/account/clips');
});

test('edit and new paths match the intercepted admin sheet urls', () => {
  assert.equal(getEntityEditPath('talks', 'talk123'), '/talks/edit/talk123');
  assert.equal(getEntityNewPath('clips'), '/clips/new');
});

test('media admin links prefill archived without changing data on GET', () => {
  assert.equal(
    getEntityEditPath('talks', 'talk123', { status: 'archived' }),
    '/talks/edit/talk123?status=archived'
  );
  assert.equal(
    getEntityEditPath('clips', 'clip123', { status: 'archived' }),
    '/clips/edit/clip123?status=archived'
  );
});

test('login return-to keeps nested query params on the original url', () => {
  assert.equal(
    getAdminLoginRedirect('/talks/edit/talk123?status=archived'),
    '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
  );
});
