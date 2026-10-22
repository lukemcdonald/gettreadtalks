import { Link } from '@/components/ui/link';

interface TalkCardSubtitleProps {
  scripture?: string | null;
  speakerHref?: string;
  speakerName?: string;
}

function SpeakerName({ href, name }: { href?: string; name: string }) {
  if (href) {
    return (
      <Link
        className="relative z-10 shrink-0 hover:underline"
        href={href}
        prefetch={false}
      >
        {name}
      </Link>
    );
  }

  return <span className="shrink-0">{name}</span>;
}

export function TalkCardSubtitle({
  scripture,
  speakerHref,
  speakerName,
}: TalkCardSubtitleProps) {
  const showScripture = Boolean(scripture);
  const showSpeaker = Boolean(speakerName);

  if (!(showScripture || showSpeaker)) {
    return;
  }

  return (
    <span className="flex min-w-0 items-baseline">
      {showSpeaker && speakerName ? (
        <SpeakerName href={speakerHref} name={speakerName} />
      ) : null}
      {showScripture && showSpeaker ? (
        <span aria-hidden="true" className="shrink-0 px-1">
          ·
        </span>
      ) : null}
      {showScripture ? (
        <span className="min-w-0 truncate">{scripture}</span>
      ) : null}
    </span>
  );
}
