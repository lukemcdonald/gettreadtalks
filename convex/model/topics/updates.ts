export function toTopicUpdates(fields: {
  description?: string;
  title?: string;
}) {
  const updates = { ...fields };

  if (updates.description === '') {
    updates.description = undefined;
  }

  return updates;
}
