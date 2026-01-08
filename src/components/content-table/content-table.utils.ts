import type { StatusType } from '@/convex/lib/validators/shared';

export function getStatusColor(status: StatusType) {
  switch (status) {
    case 'published':
      return 'bg-green-500';
    case 'approved':
      return 'bg-blue-500';
    case 'backlog':
      return 'bg-yellow-500';
    case 'archived':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

export function getStatusLabel(status: StatusType) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(timestamp?: number) {
  if (!timestamp) {
    return 'N/A';
  }
  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
