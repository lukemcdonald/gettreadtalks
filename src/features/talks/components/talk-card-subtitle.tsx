import { Link } from '@/components/ui/link';

interface TalkCardSubtitleProps {
  format?: string | null;
  scripture?: string | null;
  speakerHref?: string;
  speakerName?: string;
}

function SubtitleSeparator() {
  return (
    <span aria-hidden="true" className="shrink-0 px-1">
      ·
    </span>
  );
}

function SpeakerNameLink({ href, name }: { href: string; name: string }) {
  return (
    <Link
      className="relative z-10 shrink-0 hover:underline"
      href={href}
      prefetch="intent"
    >
      {name}
    </Link>
  );
}

function SpeakerName({ href, name }: { href?: string; name: string }) {
  if (href) {
    return <SpeakerNameLink href={href} name={name} />;
  }

  return <span className="shrink-0">{name}</span>;
}

export function TalkCardSubtitle({
  format,
  scripture,
  speakerHref,
  speakerName,
}: TalkCardSubtitleProps) {
  const showFormat = Boolean(format);
  const showScripture = Boolean(scripture);
  const showSpeaker = Boolean(speakerName);

  if (!(showFormat || showScripture || showSpeaker)) {
    return;
  }

  return (
    <span className="flex min-w-0 items-baseline">
      {showSpeaker && speakerName ? (
        <SpeakerName href={speakerHref} name={speakerName} />
      ) : null}
      {showSpeaker && (showScripture || showFormat) ? (
        <SubtitleSeparator />
      ) : null}
      {showScripture ? (
        <span className="min-w-0 truncate">{scripture}</span>
      ) : null}
      {showScripture && showFormat ? <SubtitleSeparator /> : null}
      {showFormat ? <span className="shrink-0">{format}</span> : null}
    </span>
  );
}
