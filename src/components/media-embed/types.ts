interface MediaEntity {
  entityId: string;
  entitySlug: string;
}

export type MediaTrackingContext = MediaEntity &
  (
    | { entityType: 'clip' }
    | {
        entityTitle: string;
        entityType: 'talk';
        speakerId?: string;
        speakerSlug?: string;
      }
  );
