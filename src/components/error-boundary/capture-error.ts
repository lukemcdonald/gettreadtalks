import type { ErrorWithEventId } from '@/services/errors/types';

import { captureException } from '@/services/errors';

const wrappedThrown = new WeakMap<object, Error>();
const pendingPrimitives = new Map<unknown, ErrorWithEventId>();

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (
    error !== null &&
    (typeof error === 'object' || typeof error === 'function')
  ) {
    const cached = wrappedThrown.get(error);
    if (cached) {
      return cached;
    }

    const wrapped = new Error(String(error));
    wrappedThrown.set(error, wrapped);
    return wrapped;
  }

  return new Error(String(error));
}

export function getCapturedError(error: unknown): ErrorWithEventId {
  const pending = pendingPrimitives.get(error);
  if (pending) {
    return pending;
  }

  const err = toError(error) as ErrorWithEventId;

  if (!Object.hasOwn(err, '__sentryEventId')) {
    err.__sentryEventId = captureException(err);
  }

  if (
    !(error instanceof Error) &&
    (error === null || typeof error !== 'object')
  ) {
    pendingPrimitives.set(error, err);
  }

  return err;
}

export function consumeCapturedError(error: unknown): ErrorWithEventId {
  const captured = getCapturedError(error);
  pendingPrimitives.delete(error);

  return captured;
}
