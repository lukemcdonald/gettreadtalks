import type { ActionCtx } from '../../_generated/server';

import { parse } from 'convex-helpers/validators';
import { ConvexError, v } from 'convex/values';

import { internal } from '../../_generated/api';
import { talkTranscriptFields } from './schema';
import { talkStudyContentFields } from './validators';

const enrichmentBody = v.object({
  study: v.optional(
    v.object({
      generator: v.string(),
      ...talkStudyContentFields,
      talkId: v.id('talks'),
    })
  ),
  transcript: v.optional(v.object(talkTranscriptFields)),
});

export async function handleEnrichmentRequest(ctx: ActionCtx, req: Request) {
  if (!isAuthorizedEnrichmentRequest(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  return await saveEnrichment(ctx, req);
}

function isAuthorizedEnrichmentRequest(req: Request) {
  const expected = process.env.ENRICHMENT_API_TOKEN ?? '';

  return (
    expected.length > 0 &&
    hasMatchingToken(
      readBearerToken(req.headers.get('Authorization')),
      expected
    )
  );
}

async function saveEnrichment(ctx: ActionCtx, req: Request) {
  try {
    const body = parseEnrichmentBody(await req.json());
    let studyId = null;
    let transcriptId = null;

    if (body.study) {
      studyId = await ctx.runMutation(
        internal.talks.saveTalkStudyDraft,
        body.study
      );
    }

    if (body.transcript) {
      transcriptId = await ctx.runMutation(
        internal.talks.upsertTalkTranscript,
        body.transcript
      );
    }

    return Response.json({ studyId, transcriptId });
  } catch (error) {
    return toEnrichmentErrorResponse(error);
  }
}

function toEnrichmentErrorResponse(error: unknown) {
  if (isConflictError(error)) {
    return new Response('Study already reviewed', { status: 409 });
  }

  return new Response('Bad request', { status: 400 });
}

function isConflictError(error: unknown) {
  return (
    error instanceof ConvexError &&
    (error.data as { statusCode?: number }).statusCode === 409
  );
}

function parseEnrichmentBody(value: unknown) {
  const body = parse(enrichmentBody, value);

  if (!(body.study || body.transcript)) {
    throw new Error('empty');
  }

  return body;
}

function readBearerToken(header: string | null) {
  const prefix = 'Bearer ';

  if (!header?.startsWith(prefix)) {
    return '';
  }

  return header.slice(prefix.length);
}

function hasMatchingToken(provided: string, expected: string) {
  const length = Math.max(provided.length, expected.length);
  let mismatch = Number(provided.length !== expected.length);

  for (let index = 0; index < length; index += 1) {
    mismatch += Number(provided[index] !== expected[index]);
  }

  return mismatch === 0;
}
