import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  getAdminListPath,
  getAdminLoginRedirect,
  getEntityEditPath,
  getEntityNewPath,
} from './paths.ts';

describe('getAdminListPath', () => {
  test('returns the account admin page', () => {
    assert.equal(getAdminListPath('talks'), '/account/talks');
  });
});

describe('getEntityEditPath', () => {
  test('matches the intercepted admin sheet url', () => {
    assert.equal(getEntityEditPath('talks', 'talk123'), '/talks/edit/talk123');
  });

  test('prefills archived status', () => {
    assert.equal(
      getEntityEditPath('talks', 'talk123', { status: 'archived' }),
      '/talks/edit/talk123?status=archived'
    );
  });
});

describe('getEntityNewPath', () => {
  test('matches the intercepted admin sheet url', () => {
    assert.equal(getEntityNewPath('clips'), '/clips/new');
  });
});

describe('getAdminLoginRedirect', () => {
  test('keeps nested query params on the original url', () => {
    assert.equal(
      getAdminLoginRedirect('/talks/edit/talk123?status=archived'),
      '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
    );
  });
});
