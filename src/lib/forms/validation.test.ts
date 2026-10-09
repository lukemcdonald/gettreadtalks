import { ConvexError } from 'convex/values';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { describe, test } from 'node:test';

import { ErrorCodes } from '../../services/errors/constants.ts';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const { mapConvexErrorToFormErrors } = await import('./validation.ts');

describe('mapConvexErrorToFormErrors', () => {
  test('maps a field error onto that field', () => {
    const error = new ConvexError({
      field: 'slug',
      message: 'Already taken',
    });

    assert.deepEqual(mapConvexErrorToFormErrors(error), {
      slug: 'Already taken',
    });
  });

  test('maps a duplicate slug error onto title', () => {
    const error = new ConvexError({
      errorCode: ErrorCodes.DUPLICATE_SLUG,
      message: 'That title is already in use',
    });

    assert.deepEqual(mapConvexErrorToFormErrors(error), {
      title: 'That title is already in use',
    });
  });

  test('maps an unknown error onto the form', () => {
    assert.deepEqual(mapConvexErrorToFormErrors(new Error('Something broke')), {
      _form: 'Something broke',
    });
  });
});
