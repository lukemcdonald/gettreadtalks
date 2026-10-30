import type { Id } from '../../_generated/dataModel';
import type { ActionCtx } from '../../_generated/server';
import type { TranscriptFetchFailure } from './transcriptFetch';

import { internal } from '../../_generated/api';
import { getVideoId } from '../../lib/videoUrl';
import { resolveTranscriptFetch } from './transcriptFetch';

export const NO_TRANSCRIPT_SOURCE_MESSAGE = 'Add a media URL to generate.';

export function hasTalkTranscriptSourceFromMediaUrl(mediaUrl: string) {
  const video = getVideoId(mediaUrl);

  return video?.service === 'youtube';
}

export const talkTranscriptResolver = {
  resolve: resolveTranscriptFetch,
};

export type EnsureTalkTranscriptResult =
  | TranscriptFetchFailure
  | { status: 'success'; text: string };

export async function ensureTalkTranscriptText(
  ctx: ActionCtx,
  talkId: Id<'talks'>,
  existingTranscript: string | null,
  mediaUrl: string
): Promise<
  | { errorCode: 'NO_TRANSCRIPT_SOURCE'; message: string; status: 'failed' }
  | EnsureTalkTranscriptResult
> {
  const trimmed = existingTranscript?.trim();

  if (trimmed) {
    return {
      status: 'success',
      text: trimmed,
    };
  }

  if (!hasTalkTranscriptSourceFromMediaUrl(mediaUrl)) {
    return {
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: NO_TRANSCRIPT_SOURCE_MESSAGE,
      status: 'failed',
    };
  }

  const result = await talkTranscriptResolver.resolve(
    mediaUrl,
    process.env.YOUTUBE_TRANSCRIPT_IO_TOKEN ?? ''
  );

  await ctx.runMutation(internal.talks.saveTalkTranscriptFetchOutcome, {
    talkId,
    ...(result.status === 'failed'
      ? {
          errorCode: result.errorCode,
          message: result.message,
          retryAfter: result.retryAfter,
          status: 'failed' as const,
        }
      : {
          status: 'success' as const,
          text: result.text,
        }),
  });

  return result;
}
