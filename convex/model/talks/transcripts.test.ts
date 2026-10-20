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
    studyGuide: [{ kind: 'key_idea' as const, text: draftSecret }],
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
  it('replaces an existing transcript and excludes that talk from the missing list', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(internal.talks.upsertTalkTranscript, {
      source: 'youtube_captions',
      status: 'done',
      talkId: talk._id,
      text: 'first pass',
    });
    await t.mutation(internal.talks.upsertTalkTranscript, {
      source: 'speaker_audio_stt',
      status: 'done',
      talkId: talk._id,
      text: transcriptSecret,
    });

    const missing = await asAdmin.query(api.talks.listTalksWithoutTranscript, {
      status: 'all',
    });
    const transcripts = await asAdmin.query(api.talks.listTalkTranscripts, {});

    expect(transcripts).toEqual([
      expect.objectContaining({
        source: 'speaker_audio_stt',
        status: 'done',
        talkId: talk._id,
      }),
    ]);
    expect(transcripts[0]).not.toHaveProperty('text');
    expect(JSON.stringify(transcripts)).not.toContain(transcriptSecret);
    expect(missing.map((item) => item.slug)).not.toContain(
      visibilitySlugs.publishedTalk
    );
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

  it('refuses to overwrite a published study', async () => {
    const { t, talk } = await seedPublishedTalk();
    const reviewedAt = 1_700_000_000_000;
    const reviewedSummary = 'Reviewed published summary';
    const studyId = await t.run(
      async (ctx) =>
        await ctx.db.insert('talkStudies', {
          generatedAt: reviewedAt,
          generator: 'reviewer',
          manuallyEditedAt: reviewedAt,
          outline: [{ heading: 'Grace', text: 'Reviewed outline' }],
          scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
          studyGuide: [{ kind: 'key_idea', text: 'Reviewed idea' }],
          studyStatus: 'published',
          suggestedTopics: ['grace'],
          summary: reviewedSummary,
          talkId: talk._id,
        })
    );

    const previous = process.env.ENRICHMENT_API_TOKEN;

    try {
      process.env.ENRICHMENT_API_TOKEN = 'correct-token';

      const response = await t.fetch('/enrichment', {
        body: JSON.stringify({ study: studyDraftArgs(talk._id) }),
        headers: { Authorization: 'Bearer correct-token' },
        method: 'POST',
      });

      expect(response.status).toBe(409);
    } finally {
      if (previous === undefined) {
        delete process.env.ENRICHMENT_API_TOKEN;
      } else {
        process.env.ENRICHMENT_API_TOKEN = previous;
      }
    }

    const study = await t.run(async (ctx) => await ctx.db.get(studyId));

    expect(study).toEqual(
      expect.objectContaining({
        generatedAt: reviewedAt,
        generator: 'reviewer',
        manuallyEditedAt: reviewedAt,
        studyStatus: 'published',
        summary: reviewedSummary,
      })
    );
  });

  it('returns 401 when the enrichment token is missing or wrong', async () => {
    const t = createConvexTest();
    const previous = process.env.ENRICHMENT_API_TOKEN;

    try {
      process.env.ENRICHMENT_API_TOKEN = 'correct-token';

      const missing = await t.fetch('/enrichment', {
        body: '{}',
        method: 'POST',
      });
      const wrong = await t.fetch('/enrichment', {
        body: '{}',
        headers: { Authorization: 'Bearer wrong-token' },
        method: 'POST',
      });

      expect(missing.status).toBe(401);
      expect(wrong.status).toBe(401);
    } finally {
      if (previous === undefined) {
        delete process.env.ENRICHMENT_API_TOKEN;
      } else {
        process.env.ENRICHMENT_API_TOKEN = previous;
      }
    }
  });
});

describe('talk study review mutations', () => {
  it('sets manuallyEditedAt when an admin updates study content', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(
      internal.talks.saveTalkStudyDraft,
      studyDraftArgs(talk._id)
    );

    const before = Date.now();
    const editedSummary = 'Edited summary of grace.';

    await asAdmin.mutation(api.talks.updateTalkStudy, {
      outline: [{ heading: 'Grace', text: 'Edited outline' }],
      scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
      studyGuide: [{ kind: 'key_idea', text: 'Edited idea' }],
      suggestedTopics: ['grace'],
      summary: editedSummary,
      talkId: talk._id,
    });

    const study = await asAdmin.query(api.talks.getTalkStudy, {
      talkId: talk._id,
    });

    expect(study).toEqual(
      expect.objectContaining({
        manuallyEditedAt: expect.any(Number),
        studyStatus: 'draft',
        summary: editedSummary,
      })
    );
    expect(study?.manuallyEditedAt).toBeGreaterThanOrEqual(before);
  });

  it('publishes and unpublishes one study', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.mutation(
      internal.talks.saveTalkStudyDraft,
      studyDraftArgs(talk._id)
    );

    await asAdmin.mutation(api.talks.setTalkStudyStatus, {
      studyStatus: 'published',
      talkId: talk._id,
    });

    const published = await asAdmin.query(api.talks.getTalkStudy, {
      talkId: talk._id,
    });

    expect(published?.studyStatus).toBe('published');

    await asAdmin.mutation(api.talks.setTalkStudyStatus, {
      studyStatus: 'draft',
      talkId: talk._id,
    });

    const unpublished = await asAdmin.query(api.talks.getTalkStudy, {
      talkId: talk._id,
    });

    expect(unpublished?.studyStatus).toBe('draft');
  });
});
