import { ConvexError } from 'convex/values';
import { describe, expect, test } from 'vitest';

import { getErrorMessage } from './convex';
import {
  looksLikeDeveloperError,
  reportUnexpectedError,
  toUserErrorMessage,
  USER_ERROR_MESSAGE,
} from './user-facing';

describe('looksLikeDeveloperError', () => {
  test('flags env vars, config hints, and stacks', () => {
    expect(looksLikeDeveloperError('Set NEXT_PUBLIC_TURNSTILE_SITE_KEY')).toBe(
      true
    );
    expect(looksLikeDeveloperError('TURNSTILE_SECRET_KEY is not set')).toBe(
      true
    );
    expect(
      looksLikeDeveloperError('Missing required environment variables')
    ).toBe(true);
    expect(looksLikeDeveloperError('Error\n    at foo (bar.ts:1:1)')).toBe(
      true
    );
  });

  test('allows normal user messages', () => {
    expect(looksLikeDeveloperError('Invalid email or password')).toBe(false);
    expect(looksLikeDeveloperError('Already taken')).toBe(false);
    expect(looksLikeDeveloperError('Resource not found')).toBe(false);
  });
});

describe('toUserErrorMessage', () => {
  test('keeps safe auth copy and uses the fallback when empty', () => {
    expect(toUserErrorMessage('Invalid email or password', 'Fallback')).toBe(
      'Invalid email or password'
    );
    expect(toUserErrorMessage(undefined, 'Fallback')).toBe('Fallback');
  });

  test('replaces config leaks with the fallback', () => {
    expect(
      toUserErrorMessage(
        'Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
        'Try again later'
      )
    ).toBe('Try again later');
  });
});

describe('getErrorMessage', () => {
  test('keeps structured Convex user messages', () => {
    const error = new ConvexError({
      message: 'Already taken',
    });

    expect(getErrorMessage(error)).toBe('Already taken');
  });

  test('hides raw Error messages and config leaks', () => {
    expect(getErrorMessage(new Error('Something broke'))).toBe(
      USER_ERROR_MESSAGE
    );
    expect(getErrorMessage(new Error('Set NEXT_PUBLIC_CONVEX_URL'))).toBe(
      USER_ERROR_MESSAGE
    );
    expect(
      getErrorMessage(
        new ConvexError({
          message: 'NEXT_PUBLIC_CONVEX_URL is not set',
        })
      )
    ).toBe(USER_ERROR_MESSAGE);
  });
});

describe('reportUnexpectedError', () => {
  test('returns the friendly user message', () => {
    expect(
      reportUnexpectedError(new Error('TURNSTILE_SECRET_KEY is not set'), {
        fingerprint: ['config', 'turnstile-secret-key'],
      })
    ).toBe(USER_ERROR_MESSAGE);
  });
});
