import { ConvexError } from 'convex/values';

import { ErrorCodes } from '@/services/errors/constants';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';
import { describe, expect, it } from '@/test';

import { toConvexFormErrors } from './validation';

describe('toConvexFormErrors', () => {
  it('maps a field error onto that field', () => {
    const error = new ConvexError({
      field: 'slug',
      message: 'Already taken',
    });

    expect(toConvexFormErrors(error)).toEqual({
      slug: 'Already taken',
    });
  });

  it('maps a duplicate slug error onto title', () => {
    const error = new ConvexError({
      errorCode: ErrorCodes.DUPLICATE_SLUG,
      message: 'That title is already in use',
    });

    expect(toConvexFormErrors(error)).toEqual({
      title: 'That title is already in use',
    });
  });

  it('maps an unknown error onto a friendly form message', () => {
    expect(toConvexFormErrors(new Error('Something broke'))).toEqual({
      _form: USER_ERROR_MESSAGE,
    });
  });
});
