import { ConvexError } from 'convex/values';
import { describe, expect, test } from 'vitest';

import { ErrorCodes } from '../../services/errors/constants';
import { mapConvexErrorToFormErrors } from './validation';

describe('mapConvexErrorToFormErrors', () => {
  test('maps a field error onto that field', () => {
    const error = new ConvexError({
      field: 'slug',
      message: 'Already taken',
    });

    expect(mapConvexErrorToFormErrors(error)).toEqual({
      slug: 'Already taken',
    });
  });

  test('maps a duplicate slug error onto title', () => {
    const error = new ConvexError({
      errorCode: ErrorCodes.DUPLICATE_SLUG,
      message: 'That title is already in use',
    });

    expect(mapConvexErrorToFormErrors(error)).toEqual({
      title: 'That title is already in use',
    });
  });

  test('maps an unknown error onto the form', () => {
    expect(mapConvexErrorToFormErrors(new Error('Something broke'))).toEqual({
      _form: 'Something broke',
    });
  });
});
