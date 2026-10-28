import { MediaCardSubtitle } from '@/components/media-card';
import { TalkCardSubtitle } from '@/features/talks/components/talk-card-subtitle';

interface SearchResultItemProps {
  scripture?: string | null;
  subtitle?: string;
  title: string;
}

export function SearchResultItem({
  scripture,
  subtitle,
  title,
}: SearchResultItemProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="font-semibold">{title}</span>
      {!!(scripture || subtitle) && (
        <MediaCardSubtitle>
          <TalkCardSubtitle scripture={scripture} speakerName={subtitle} />
        </MediaCardSubtitle>
      )}
    </div>
  );
}
