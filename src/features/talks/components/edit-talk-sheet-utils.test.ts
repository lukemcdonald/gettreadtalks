import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkWithTopicIds } from '@/features/talks/types';

import { describe, expect, it } from '@/test';

import {
  getTalkFormValues,
  getUrlChangeForTalk,
} from './edit-talk-sheet-utils';

const speakerId = 'speakers:jones' as Talk['speakerId'];
const otherSpeakerId = 'speakers:piper' as Talk['speakerId'];

function publishedTalk(overrides: Partial<Talk> = {}): Talk {
  return {
    _creationTime: 0,
    _id: 'talks:the-cross' as Talk['_id'],
    slug: 'the-cross',
    speakerId,
    status: 'published',
    ...overrides,
  } as Talk;
}

function talkWithTopics(
  overrides: Partial<TalkWithTopicIds> = {}
): TalkWithTopicIds {
  return {
    _creationTime: 0,
    _id: 'talks:the-cross' as TalkWithTopicIds['_id'],
    slug: 'the-cross',
    speakerId,
    status: 'published',
    title: 'The Cross',
    topicIds: [],
    ...overrides,
  } as TalkWithTopicIds;
}

function formData(overrides: Partial<TalkFormData> = {}): TalkFormData {
  return {
    featured: false,
    mediaUrl: 'https://example.com/talk',
    slug: 'the-cross',
    speakerId,
    status: 'published',
    title: 'The Cross',
    topicIds: [],
    ...overrides,
  };
}

describe('getTalkFormValues', () => {
  it('omits collection order when the talk has no collection', () => {
    const talk = talkWithTopics({
      collectionId: undefined,
      collectionOrder: 3,
      featured: undefined,
      mediaUrl: '',
      scripture: undefined,
    });

    expect(getTalkFormValues(talk)).toEqual({
      collectionId: undefined,
      collectionOrder: undefined,
      featured: false,
      mediaUrl: '',
      scripture: '',
      slug: 'the-cross',
      speakerId,
      status: 'published',
      title: 'The Cross',
      topicIds: [],
    });
  });

  it('keeps collection order and prefers a status prefill', () => {
    const talk = talkWithTopics({
      collectionId: 'collections:romans' as Talk['collectionId'],
      collectionOrder: 3,
      featured: true,
      mediaUrl: 'https://example.com/talk',
      scripture: 'Romans 8',
    });

    expect(getTalkFormValues(talk, 'archived')).toMatchObject({
      collectionOrder: 3,
      status: 'archived',
    });
  });
});

describe('getUrlChangeForTalk', () => {
  it('returns null when the talk is not published', () => {
    expect(
      getUrlChangeForTalk(publishedTalk({ status: 'backlog' }), formData())
    ).toBeNull();
  });

  it('returns null when slug and speaker stay the same', () => {
    expect(getUrlChangeForTalk(publishedTalk(), formData())).toBeNull();
  });

  it('returns null when an empty or equivalent slug keeps the existing talk slug', () => {
    expect(
      getUrlChangeForTalk(publishedTalk(), formData({ slug: '' }))
    ).toBeNull();
    expect(
      getUrlChangeForTalk(publishedTalk(), formData({ slug: 'The Cross!' }))
    ).toBeNull();
  });

  it('builds urls when the slug changes', () => {
    expect(
      getUrlChangeForTalk(
        publishedTalk(),
        formData({ slug: 'No Condemnation' })
      )
    ).toEqual({
      newUrl: '/talks/<speaker>/no-condemnation',
      oldUrl: '/talks/<speaker>/the-cross',
    });
  });

  it('uses a new-speaker placeholder when the speaker changes', () => {
    expect(
      getUrlChangeForTalk(
        publishedTalk(),
        formData({ speakerId: otherSpeakerId })
      )
    ).toEqual({
      newUrl: '/talks/<new-speaker>/the-cross',
      oldUrl: '/talks/<speaker>/the-cross',
    });
  });

  it('slugifies a new slug and marks a speaker change together', () => {
    expect(
      getUrlChangeForTalk(
        publishedTalk(),
        formData({ slug: 'No Condemnation', speakerId: otherSpeakerId })
      )
    ).toEqual({
      newUrl: '/talks/<new-speaker>/no-condemnation',
      oldUrl: '/talks/<speaker>/the-cross',
    });
  });
});
