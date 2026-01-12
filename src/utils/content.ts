import type { StatusType } from '@/lib/types';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
