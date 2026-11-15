import type { TalkFormData } from './talk-form';

import { describe, expect, it } from '@/test';

import {
  getTalkCreateFormValues,
  talkFormSchema,
  toCreateTalkInput,
} from './talk-form';

const talkFields = {
  mediaUrl: 'https://example.com/talk',
  speakerId: 'speakers:example',
  title: 'A Talk',
};

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

describe('talkFormSchema format', () => {
  it('accepts a format and keeps it on the parsed form', () => {
    const result = talkFormSchema.safeParse({
      ...talkFields,
      format: 'debate',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.format).toBe('debate');
    }
  });

  it('accepts an empty format', () => {
    const result = talkFormSchema.safeParse({
      ...talkFields,
      format: '',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.format).toBe('');
    }
  });

  it('rejects an invalid format', () => {
    const result = talkFormSchema.safeParse({
      ...talkFields,
      format: 'homily',
    });

    expect(result.success).toBe(false);
  });
});

function createTalkInput(format: TalkFormData['format']) {
  return toCreateTalkInput({
    featured: false,
    format,
    mediaUrl: talkFields.mediaUrl,
    publishedAt: '',
    speakerId: talkFields.speakerId as TalkFormData['speakerId'],
    status: 'backlog',
    title: talkFields.title,
    topicIds: [],
  });
}

describe('talk create format', () => {
  it('starts on sermon and sends that format', () => {
    expect(getTalkCreateFormValues().format).toBe('sermon');
    expect(createTalkInput(getTalkCreateFormValues().format).format).toBe(
      'sermon'
    );
  });

  it('omits an empty format', () => {
    expect(createTalkInput('')).not.toHaveProperty('format');
  });
});
