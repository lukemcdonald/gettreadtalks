import type { Topic } from '@/features/topics/types';

export function buildTopicPath(topic: Pick<Topic, 'slug'>) {
  return `/topics/${topic.slug}`;
}

export function buildTopicsPath() {
  return '/topics';
}
