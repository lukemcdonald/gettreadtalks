import { ConvexError } from 'convex/values';

import { describe, expect, it } from '@/test';

import { formatErrorMessage } from './convex';
import {
  USER_ERROR_MESSAGE,
  reportUnexpectedError,
  toUserErrorMessage,
} from './user-facing';

describe('toUserErrorMessage', () => {
  it('keeps safe auth copy and uses the fallback when empty', () => {
    expect(toUserErrorMessage('Invalid email or password', 'Fallback')).toBe(
      'Invalid email or password'
    );
    expect(toUserErrorMessage('Already taken', 'Fallback')).toBe(
      'Already taken'
    );
    expect(toUserErrorMessage('Resource not found', 'Fallback')).toBe(
      'Resource not found'
    );
    expect(toUserErrorMessage(undefined, 'Fallback')).toBe('Fallback');
  });

  it('replaces config leaks with the fallback', () => {
    expect(
      toUserErrorMessage(
        'Set NEXT_PUBLIC_TURNSTILE_SITE_KEY',
        'Try again later'
      )
    ).toBe('Try again later');
    expect(
      toUserErrorMessage('TURNSTILE_SECRET_KEY is not set', 'Try again later')
    ).toBe('Try again later');
    expect(
      toUserErrorMessage(
        'Missing required environment variables',
        'Try again later'
      )
    ).toBe('Try again later');
    expect(
      toUserErrorMessage('Error\n    at foo (bar.ts:1:1)', 'Try again later')
    ).toBe('Try again later');
    expect(
      toUserErrorMessage(
        'Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
        'Try again later'
      )
    ).toBe('Try again later');
  });
});

describe('formatErrorMessage', () => {
  it('keeps structured Convex user messages', () => {
    const error = new ConvexError({
      message: 'Already taken',
    });

    expect(formatErrorMessage(error)).toBe('Already taken');
  });

  it('hides raw Error messages and config leaks', () => {
    expect(formatErrorMessage(new Error('Something broke'))).toBe(
      USER_ERROR_MESSAGE
    );
    expect(formatErrorMessage(new Error('Set NEXT_PUBLIC_CONVEX_URL'))).toBe(
      USER_ERROR_MESSAGE
    );
    expect(
      formatErrorMessage(
        new ConvexError({
          message: 'NEXT_PUBLIC_CONVEX_URL is not set',
        })
      )
    ).toBe(USER_ERROR_MESSAGE);
  });
});

describe('reportUnexpectedError', () => {
  it('returns the friendly user message', () => {
    expect(
      reportUnexpectedError(new Error('TURNSTILE_SECRET_KEY is not set'), {
        fingerprint: ['config', 'turnstile-secret-key'],
      })
    ).toBe(USER_ERROR_MESSAGE);
  });
});
