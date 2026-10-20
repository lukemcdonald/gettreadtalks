import type { Id } from '../../_generated/dataModel';

import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';

const draftSecret = 'PRIVATE_STUDY_DRAFT_SENTINEL_volt332';
const transcriptSecret = 'PRIVATE_TRANSCRIPT_SENTINEL_volt332';

function studyDraftArgs(talkId: Id<'talks'>) {
  return {
    generator: 'grok-bot',
    outline: [{ heading: 'Grace', text: 'Grace is a gift' }],
    scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
    studyGuide: [
      {
        kind: 'key_idea' as const,
        scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
        text: draftSecret,
      },
    ],
    suggestedTopics: ['grace'],
    summary: 'A draft summary of grace.',
    talkId,
  };
}

async function seedPublishedTalk() {
  const t = createConvexTest();
  await seedVisibilityCatalog(t);
  const published = await t.query(api.talks.getTalkBySlug, {
    speakerSlug: visibilitySlugs.publishedSpeaker,
    talkSlug: visibilitySlugs.publishedTalk,
  });

  expect(published).not.toBeNull();

  if (!published) {
    throw new Error('expected a published talk');
  }

  const { asUser: asAdmin } = await signInAs(t, {
    email: 'admin@example.test',
    name: 'Admin',
    role: 'admin',
  });

  return {
    asAdmin,
    t,
    talk: published.talk,
  };
}

describe('talk transcript and study draft storage', () => {
  it('upserts a transcript and draft, then lists the other talks as missing', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(internal.talks.upsertTalkTranscript, {
      fetchedAt: Date.parse('2026-10-20T12:00:00.000Z'),
      model: 'faster-whisper large-v3-turbo',
      quality: 'good',
      source: 'speaker_audio_stt',
      status: 'done',
      talkId: talk._id,
      text: transcriptSecret,
      wordCount: 3,
    });
    await t.mutation(
      internal.talks.saveTalkStudyDraft,
      studyDraftArgs(talk._id)
    );

    const drafts = await asAdmin.query(api.talks.listDraftTalkStudies, {});
    const missingPublished = await asAdmin.query(
      api.talks.listTalksWithoutTranscript,
      {}
    );
    const missingAll = await asAdmin.query(
      api.talks.listTalksWithoutTranscript,
      { status: 'all' }
    );
    const transcripts = await asAdmin.query(api.talks.listTalkTranscripts, {});

    expect(drafts).toEqual([
      expect.objectContaining({
        outline: [{ heading: 'Grace', text: 'Grace is a gift' }],
        scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
        studyGuide: [
          {
            kind: 'key_idea',
            scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
            text: draftSecret,
          },
        ],
        studyStatus: 'draft',
        talkId: talk._id,
      }),
    ]);
    expect(missingPublished.map((item) => item.slug)).not.toContain(
      visibilitySlugs.publishedTalk
    );
    expect(missingAll.map((item) => item.slug).toSorted()).toEqual(
      ['unpublished-from-draft-speaker', visibilitySlugs.draftTalk].toSorted()
    );
    expect(transcripts).toEqual([
      expect.objectContaining({
        quality: 'good',
        source: 'speaker_audio_stt',
        status: 'done',
        talkId: talk._id,
        wordCount: 3,
      }),
    ]);
    expect(transcripts[0]).not.toHaveProperty('text');
    expect(JSON.stringify(transcripts)).not.toContain(transcriptSecret);
  });

  it('lists poor transcripts and replaces a prior transcript row', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(internal.talks.upsertTalkTranscript, {
      quality: 'good',
      source: 'youtube_captions',
      status: 'done',
      talkId: talk._id,
      text: 'first pass',
    });
    await t.mutation(internal.talks.upsertTalkTranscript, {
      failureReason: 'low confidence',
      quality: 'poor',
      source: 'video_audio_stt',
      status: 'done',
      talkId: talk._id,
      text: transcriptSecret,
    });

    const poor = await asAdmin.query(api.talks.listTalkTranscripts, {
      quality: 'poor',
    });
    const youtube = await asAdmin.query(api.talks.listTalkTranscripts, {
      source: 'youtube_captions',
    });

    expect(poor).toEqual([
      expect.objectContaining({
        failureReason: 'low confidence',
        quality: 'poor',
        source: 'video_audio_stt',
        talkId: talk._id,
      }),
    ]);
    expect(youtube).toEqual([]);
  });

  it('removes transcript and study rows when a talk is destroyed', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(internal.talks.upsertTalkTranscript, {
      source: 'manual',
      status: 'done',
      talkId: talk._id,
      text: transcriptSecret,
    });
    await t.mutation(
      internal.talks.saveTalkStudyDraft,
      studyDraftArgs(talk._id)
    );

    await asAdmin.mutation(api.talks.destroyTalk, { talkId: talk._id });

    const drafts = await asAdmin.query(api.talks.listDraftTalkStudies, {});
    const transcripts = await asAdmin.query(api.talks.listTalkTranscripts, {});

    expect(drafts).toEqual([]);
    expect(transcripts).toEqual([]);
  });
});
