import {
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Link,
  Separator,
} from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';
import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
  UnfavoriteTalkButton,
} from './_components/unfavorite-buttons';

export default async function FavoritesPage() {
  const favorites = await getUserFavorites();

  const talks = favorites?.talks ?? [];
  const speakers = favorites?.speakers ?? [];
  const clips = favorites?.clips ?? [];
  const total = talks.length + speakers.length + clips.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-3xl text-card-foreground">Favorites</h1>
          {total > 0 && (
            <span className="text-muted-foreground text-sm">
              {talks.length} talks · {speakers.length} speakers · {clips.length} clips
            </span>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-6 py-8">
        {total === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No favorites yet</EmptyTitle>
              <EmptyDescription>Start exploring to build your collection!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-10">
            {talks.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-card-foreground text-lg">
                  Favorite Talks ({talks.length})
                </h2>
                <ul className="divide-y divide-border rounded-lg border">
                  {talks.map((talk) => (
                    <li
                      className="flex items-center justify-between gap-4 px-4 py-3"
                      key={talk._id}
                    >
                      <div className="min-w-0">
                        <Link
                          className="truncate font-medium text-card-foreground text-sm hover:text-primary"
                          href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
                        >
                          {talk.title}
                        </Link>
                        {talk.speaker && (
                          <p className="truncate text-muted-foreground text-sm">
                            {talk.speaker.firstName} {talk.speaker.lastName}
                          </p>
                        )}
                      </div>
                      <UnfavoriteTalkButton talkId={talk._id} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {speakers.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-card-foreground text-lg">
                  Favorite Speakers ({speakers.length})
                </h2>
                <ul className="divide-y divide-border rounded-lg border">
                  {speakers.map((speaker) => (
                    <li
                      className="flex items-center justify-between gap-4 px-4 py-3"
                      key={speaker._id}
                    >
                      <Link
                        className="font-medium text-card-foreground text-sm hover:text-primary"
                        href={`/speakers/${speaker.slug}`}
                      >
                        {speaker.firstName} {speaker.lastName}
                      </Link>
                      <UnfavoriteSpeakerButton speakerId={speaker._id} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {clips.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-card-foreground text-lg">
                  Favorite Clips ({clips.length})
                </h2>
                <ul className="divide-y divide-border rounded-lg border">
                  {clips.map((clip) => (
                    <li
                      className="flex items-center justify-between gap-4 px-4 py-3"
                      key={clip._id}
                    >
                      <Link
                        className="font-medium text-card-foreground text-sm hover:text-primary"
                        href={`/clips/${clip.slug}`}
                      >
                        {clip.title}
                      </Link>
                      <UnfavoriteClipButton clipId={clip._id} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
