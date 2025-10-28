interface SpeakerInfoProps {
  speaker: {
    firstName: string;
    lastName: string;
    description?: string;
    role?: string;
    ministry?: string;
  };
}

export function SpeakerInfo({ speaker }: SpeakerInfoProps) {
  return (
    <section className="mb-4">
      <h2 className="text-lg font-bold">Speaker</h2>
      <p>
        {speaker.firstName} {speaker.lastName}
      </p>
      {speaker.description && <p>{speaker.description}</p>}
      {speaker.role && (
        <p>
          <strong>Role:</strong> {speaker.role}
        </p>
      )}
      {speaker.ministry && (
        <p>
          <strong>Ministry:</strong> {speaker.ministry}
        </p>
      )}
    </section>
  );
}
