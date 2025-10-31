import { Badge, Heading, Text } from '@/components/ui';

interface TalkDetailsProps {
  talk: {
    description?: string;
    featured?: boolean;
    mediaUrl?: string;
    publishedAt?: number;
    scripture?: string;
    status: string;
  };
}

export function TalkDetails({ talk }: TalkDetailsProps) {
  return (
    <section className="space-y-3">
      <Heading as="h2" size="xl">
        Talk Details
      </Heading>
      <div className="space-y-2">
        <Text size="sm">
          <Text as="span" weight="semibold">
            Status:
          </Text>{' '}
          <Badge variant={talk.status === 'published' ? 'success' : 'neutral'} size="sm">
            {talk.status}
          </Badge>
        </Text>
        <Text size="sm">
          <Text as="span" weight="semibold">
            Published:
          </Text>{' '}
          {talk.publishedAt ? new Date(talk.publishedAt).toLocaleDateString() : 'Not published'}
        </Text>
        {talk.featured && (
          <Badge variant="primary" size="sm">
            Featured Talk
          </Badge>
        )}
      </div>
      {talk.description && <Text color="neutral">{talk.description}</Text>}
      {talk.scripture && (
        <div>
          <Text weight="semibold" size="sm">
            Scripture:
          </Text>
          <Text size="sm">{talk.scripture}</Text>
        </div>
      )}
      {talk.mediaUrl && (
        <div>
          <Text weight="semibold" size="sm">
            Media:
          </Text>
          <Text size="sm">
            <a
              className="text-primary hover:underline"
              href={talk.mediaUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              View Media
            </a>
          </Text>
        </div>
      )}
    </section>
  );
}
