import { Badge, Card, CardContent, Heading, Text } from '@/components/ui';

interface ClipsListProps {
  clips: Array<{
    _id: string;
    description?: string;
    mediaUrl: string;
    publishedAt?: number;
    status: string;
    title: string;
  }>;
}

export function ClipsList({ clips }: ClipsListProps) {
  return (
    <section className="space-y-3">
      <Heading as="h2" size="xl">
        Clips ({clips.length})
      </Heading>
      <div className="space-y-3">
        {clips.map((clip) => (
          <Card key={clip._id} variant="bordered" padding="md">
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Text weight="semibold">{clip.title}</Text>
                <Badge variant={clip.status === 'published' ? 'success' : 'neutral'} size="sm">
                  {clip.status}
                </Badge>
              </div>
              {clip.description && (
                <Text size="sm" color="neutral">
                  {clip.description}
                </Text>
              )}
              <div className="flex items-center gap-4 pt-2">
                <Text size="sm">
                  <a
                    className="text-primary hover:underline"
                    href={clip.mediaUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View Clip
                  </a>
                </Text>
                {clip.publishedAt && (
                  <Text size="xs" color="neutral">
                    {new Date(clip.publishedAt).toLocaleDateString()}
                  </Text>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
