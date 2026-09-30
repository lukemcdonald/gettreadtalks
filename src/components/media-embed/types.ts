interface MediaEntity {
  entityId: string;
  entitySlug: string;
}

export type MediaTrackingContext = MediaEntity &
  (
    | { entityType: 'clip' }
    | {
        entityType: 'talk';
        speakerId?: string;
        speakerSlug?: string;
      }
  );
