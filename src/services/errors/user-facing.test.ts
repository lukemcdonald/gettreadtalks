import { ConvexError } from 'convex/values';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const { getErrorMessage } = await import('./convex.ts');
const {
  USER_ERROR_MESSAGE,
  looksLikeDeveloperError,
  reportUnexpectedError,
  toUserErrorMessage,
} = await import('./user-facing.ts');

describe('looksLikeDeveloperError', () => {
  test('flags env vars, config hints, and stacks', () => {
    assert.equal(
      looksLikeDeveloperError('Set NEXT_PUBLIC_TURNSTILE_SITE_KEY'),
      true
    );
    assert.equal(
      looksLikeDeveloperError('TURNSTILE_SECRET_KEY is not set'),
      true
    );
    assert.equal(
      looksLikeDeveloperError('Missing required environment variables'),
      true
    );
    assert.equal(
      looksLikeDeveloperError('Error\n    at foo (bar.ts:1:1)'),
      true
    );
  });

  test('allows normal user messages', () => {
    assert.equal(looksLikeDeveloperError('Invalid email or password'), false);
    assert.equal(looksLikeDeveloperError('Already taken'), false);
    assert.equal(looksLikeDeveloperError('Resource not found'), false);
  });
});

describe('toUserErrorMessage', () => {
  test('keeps safe auth copy and uses the fallback when empty', () => {
    assert.equal(
      toUserErrorMessage('Invalid email or password', 'Fallback'),
      'Invalid email or password'
    );
    assert.equal(toUserErrorMessage(undefined, 'Fallback'), 'Fallback');
  });

  test('replaces config leaks with the fallback', () => {
    assert.equal(
      toUserErrorMessage(
        'Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
        'Try again later'
      ),
      'Try again later'
    );
  });
});

describe('getErrorMessage', () => {
  test('keeps structured Convex user messages', () => {
    const error = new ConvexError({
      message: 'Already taken',
    });

    assert.equal(getErrorMessage(error), 'Already taken');
  });

  test('hides raw Error messages and config leaks', () => {
    assert.equal(
      getErrorMessage(new Error('Something broke')),
      USER_ERROR_MESSAGE
    );
    assert.equal(
      getErrorMessage(new Error('Set NEXT_PUBLIC_CONVEX_URL')),
      USER_ERROR_MESSAGE
    );
    assert.equal(
      getErrorMessage(
        new ConvexError({
          message: 'NEXT_PUBLIC_CONVEX_URL is not set',
        })
      ),
      USER_ERROR_MESSAGE
    );
  });
});

describe('reportUnexpectedError', () => {
  test('returns the friendly user message', () => {
    assert.equal(
      reportUnexpectedError(new Error('TURNSTILE_SECRET_KEY is not set'), {
        fingerprint: ['config', 'turnstile-secret-key'],
      }),
      USER_ERROR_MESSAGE
    );
  });
});
