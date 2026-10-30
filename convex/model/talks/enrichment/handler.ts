import type { ActionCtx } from '../../../_generated/server';

import { parse } from 'convex-helpers/validators';
import { ConvexError, v } from 'convex/values';

import { internal } from '../../../_generated/api';
import { talkTranscriptFields } from '../schema';

const enrichmentBody = v.object({
  summary: v.optional(
    v.object({
      generator: v.string(),
      summary: v.string(),
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
    let summaryTalkId = null;
    let transcriptId = null;

    if (body.summary) {
      summaryTalkId = await ctx.runMutation(
        internal.talks.saveTalkSummaryDraft,
        body.summary
      );
    }

    if (body.transcript) {
      transcriptId = await ctx.runMutation(
        internal.talks.upsertTalkTranscript,
        body.transcript
      );
    }

    return Response.json({ summaryTalkId, transcriptId });
  } catch (error) {
    return toEnrichmentErrorResponse(error);
  }
}

function toEnrichmentErrorResponse(error: unknown) {
  if (isConflictError(error)) {
    return new Response('Summary already edited', { status: 409 });
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

  if (!(body.summary || body.transcript)) {
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
