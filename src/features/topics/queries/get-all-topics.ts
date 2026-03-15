'use cache: private';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getAllTopics() {
  const topics = await fetchAuthQuery(api.topics.listAllTopics, {});

  return { topics };
}
