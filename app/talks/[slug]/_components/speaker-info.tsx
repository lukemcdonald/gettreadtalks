import { Heading, Text } from '@/components/ui';

interface SpeakerInfoProps {
  speaker: {
    description?: string;
    firstName: string;
    lastName: string;
    ministry?: string;
    role?: string;
  };
}

export function SpeakerInfo({ speaker }: SpeakerInfoProps) {
  return (
    <section className="space-y-2">
      <Heading as="h2" size="xl">
        Speaker
      </Heading>
      <Text weight="medium">
        {speaker.firstName} {speaker.lastName}
      </Text>
      {speaker.description && <Text color="neutral">{speaker.description}</Text>}
      {speaker.role && (
        <Text size="sm">
          <Text as="span" weight="semibold">
            Role:
          </Text>{' '}
          {speaker.role}
        </Text>
      )}
      {speaker.ministry && (
        <Text size="sm">
          <Text as="span" weight="semibold">
            Ministry:
          </Text>{' '}
          {speaker.ministry}
        </Text>
      )}
    </section>
  );
}
