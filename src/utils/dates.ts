export function formatDate(timestamp?: number) {
  if (!timestamp) {
    return null;
  }

  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
