'use server';

import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';
import type { SheetEntity } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTalkForEdit(id: TalkId) {
  const token = await getAuthToken();
  return fetchQuery(api.talks.getTalk, { id }, { token });
}

export async function getSpeakerForEdit(id: SpeakerId) {
  const token = await getAuthToken();
  return fetchQuery(api.speakers.getSpeaker, { speakerId: id }, { token });
}

export async function getClipForEdit(id: ClipId) {
  const token = await getAuthToken();
  return fetchQuery(api.clips.getClip, { id }, { token });
}

export async function getCollectionForEdit(id: CollectionId) {
  const token = await getAuthToken();
  return fetchQuery(api.collections.getCollection, { collectionId: id }, { token });
}

export async function getTopicForEdit(id: TopicId) {
  const token = await getAuthToken();
  return fetchQuery(api.topics.getTopic, { id }, { token });
}

export async function getEntityForEdit(entity: SheetEntity, id: string) {
  switch (entity) {
    case 'clip':
      return await getClipForEdit(id as ClipId);
    case 'collection':
      return await getCollectionForEdit(id as CollectionId);
    case 'speaker':
      return await getSpeakerForEdit(id as SpeakerId);
    case 'talk':
      return await getTalkForEdit(id as TalkId);
    case 'topic':
      return await getTopicForEdit(id as TopicId);
    default:
      return null;
  }
}
