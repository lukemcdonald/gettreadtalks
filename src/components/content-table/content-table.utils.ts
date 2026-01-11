import type { StatusType } from '@/convex/lib/validators/shared';

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

export function getStatusColor(status?: StatusType) {
  switch (status) {
    case 'approved':
      return 'text-blue-500';
    case 'archived':
      return 'text-gray-400';
    case 'backlog':
      return 'text-yellow-500';
    case 'published':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
}

export function getStatusLabel(status: StatusType) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
