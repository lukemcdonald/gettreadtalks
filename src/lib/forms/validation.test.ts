import { ConvexError } from 'convex/values';
import { describe, expect, it } from 'vitest';

import { ErrorCodes } from '../../services/errors/constants';
import { USER_ERROR_MESSAGE } from '../../services/errors/user-facing';
import { mapConvexErrorToFormErrors } from './validation';

describe('mapConvexErrorToFormErrors', () => {
  it('maps a field error onto that field', () => {
    const error = new ConvexError({
      field: 'slug',
      message: 'Already taken',
    });

    expect(mapConvexErrorToFormErrors(error)).toEqual({
      slug: 'Already taken',
    });
  });

  it('maps a duplicate slug error onto title', () => {
    const error = new ConvexError({
      errorCode: ErrorCodes.DUPLICATE_SLUG,
      message: 'That title is already in use',
    });

    expect(mapConvexErrorToFormErrors(error)).toEqual({
      title: 'That title is already in use',
    });
  });

  it('maps an unknown error onto a friendly form message', () => {
    expect(mapConvexErrorToFormErrors(new Error('Something broke'))).toEqual({
      _form: USER_ERROR_MESSAGE,
    });
  });
});
