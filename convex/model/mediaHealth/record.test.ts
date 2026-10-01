import assert from 'node:assert/strict';
import { test } from 'node:test';

import { decideMediaCheck } from './record.ts';

test('upserts a first ok check without a transition', () => {
  assert.deepEqual(
    decideMediaCheck({
      existingStatus: null,
      observedStatus: 'ok',
    }),
    {
      isTransition: false,
      persistStatus: 'ok',
    }
  );
});

test('creates a new baseline for a first private result', () => {
  assert.deepEqual(
    decideMediaCheck({
      existingStatus: null,
      observedStatus: 'private',
    }),
    {
      isTransition: false,
      persistStatus: 'private',
    }
  );
});

test('treats a new media URL as a separate baseline', () => {
  assert.deepEqual(
    decideMediaCheck({
      existingStatus: null,
      observedStatus: 'missing',
    }),
    {
      isTransition: false,
      persistStatus: 'missing',
    }
  );
});

test('notifies when ok becomes private', () => {
  assert.deepEqual(
    decideMediaCheck({
      existingStatus: 'ok',
      observedStatus: 'private',
    }),
    {
      isTransition: true,
      persistStatus: 'private',
    }
  );
});

test('keeps a prior ok when the check is unknown', () => {
  assert.deepEqual(
    decideMediaCheck({
      existingStatus: 'ok',
      observedStatus: 'unknown',
    }),
    {
      isTransition: false,
      persistStatus: 'ok',
    }
  );
});
