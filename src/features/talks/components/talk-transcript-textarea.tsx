'use client';

import { Textarea } from '@/components/ui';

export function TalkTranscriptTextarea({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <Textarea
      aria-label="Transcript"
      className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-1 [&_[data-slot=textarea]]:min-h-60 [&_[data-slot=textarea]]:min-w-0"
      data-testid="talk-transcript"
      disabled={disabled}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={value}
    />
  );
}
