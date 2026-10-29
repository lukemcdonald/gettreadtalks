import { describe, expect, it } from '@/test';

import { talkFormSchema } from './talk-form';

function parsePublishDate(publishedAt?: string) {
  return talkFormSchema.pick({ publishedAt: true }).safeParse({
    publishedAt,
  });
}

describe('talkFormSchema publishedAt', () => {
  it('accepts an empty or past publish date', () => {
    expect(parsePublishDate().success).toBe(true);
    expect(parsePublishDate('').success).toBe(true);
    expect(parsePublishDate('2020-01-15').success).toBe(true);
  });

  it('rejects a malformed or overflow publish date', () => {
    expect(parsePublishDate('2020-1-15').success).toBe(false);
    expect(parsePublishDate('2024-02-30').success).toBe(false);
  });

  it('rejects a future publish date', () => {
    const result = parsePublishDate('2099-01-01');

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe(
      'Publish date cannot be in the future'
    );
  });
});
