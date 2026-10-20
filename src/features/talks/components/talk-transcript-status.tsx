import type { TalkTranscript } from '@/features/talks/types';

import { SectionHeading } from '@/components/section-heading';
import { Textarea } from '@/components/ui';

const TRANSCRIPT_SOURCE_LABELS = {
  hosted_stt: 'Hosted speech-to-text',
  manual: 'Manual',
  speaker_audio_stt: 'Speaker audio',
  speaker_published: 'Speaker published',
  video_audio_stt: 'Video audio',
  youtube_captions: 'YouTube captions',
} as const;

const TRANSCRIPT_STATUS_LABELS = {
  blocked: 'Blocked',
  done: 'Done',
  failed: 'Failed',
} as const;

interface TalkTranscriptStatusProps {
  transcript: TalkTranscript | null;
}

export function TalkTranscriptStatus({
  transcript,
}: TalkTranscriptStatusProps) {
  return (
    <div className="space-y-4">
      <SectionHeading heading="Transcript" />
      {transcript ? (
        <>
          <p className="text-muted-foreground text-sm">
            {`${TRANSCRIPT_STATUS_LABELS[transcript.status]} · ${TRANSCRIPT_SOURCE_LABELS[transcript.source]}`}
          </p>
          {transcript.text ? (
            <Textarea readOnly rows={8} value={transcript.text} />
          ) : null}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">No transcript yet</p>
      )}
    </div>
  );
}
