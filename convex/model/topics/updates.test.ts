import { describe, expect, it } from 'vitest';

import { toTopicUpdates } from './updates';

describe('toTopicUpdates', () => {
  it('clears an empty description', () => {
    expect(toTopicUpdates({ description: '', title: 'Grace' })).toEqual({
      description: undefined,
      title: 'Grace',
    });
  });

  it('keeps a set description', () => {
    expect(
      toTopicUpdates({ description: 'Talks on grace.', title: 'Grace' })
    ).toEqual({
      description: 'Talks on grace.',
      title: 'Grace',
    });
  });

  it('leaves description alone when it is omitted', () => {
    expect(toTopicUpdates({ title: 'Grace' })).toEqual({
      title: 'Grace',
    });
  });
});
