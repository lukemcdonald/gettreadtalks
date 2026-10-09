import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { decideMediaCheck } from './record.ts';

describe('decideMediaCheck', () => {
  test('persists a first observation without a transition', () => {
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

  test('does not notify when already broken', () => {
    assert.deepEqual(
      decideMediaCheck({
        existingStatus: 'unknown',
        observedStatus: 'private',
      }),
      {
        isTransition: false,
        persistStatus: 'private',
      }
    );
    assert.deepEqual(
      decideMediaCheck({
        existingStatus: 'private',
        observedStatus: 'missing',
      }),
      {
        isTransition: false,
        persistStatus: 'missing',
      }
    );
  });
});
