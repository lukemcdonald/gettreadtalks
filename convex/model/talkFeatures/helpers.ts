export function hasReviewedTalkFeature(
  feature: {
    manuallyEditedAt?: number;
    status: 'draft' | 'published';
  } | null
) {
  return (
    feature !== null &&
    (feature.status === 'published' || feature.manuallyEditedAt !== undefined)
  );
}
