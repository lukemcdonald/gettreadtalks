export interface MediaTrackingContext {
  entityId: string;
  entitySlug: string;
  entityType: 'clip' | 'talk';
  /** Required for talk events */
  speakerSlug?: string;
}
