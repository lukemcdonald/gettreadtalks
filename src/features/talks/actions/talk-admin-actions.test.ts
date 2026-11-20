/// <reference types="vitest/globals" />

import type { TalkId } from '@/features/talks/types';
import type { AdminUser } from '@/services/auth/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';
import { beforeEach, describe, expect, it } from '@/test';

import { archiveTalkAction } from './archive-talk';
import { destroyTalkAction } from './destroy-talk';
import { updateTalkFeaturedAction } from './update-talk-featured';

vi.mock('next/cache', () => ({
  updateTag: vi.fn(),
}));

vi.mock('@/services/auth/server', () => ({
  fetchAuthMutation: vi.fn(),
  requireAdminUser: vi.fn(),
}));

const talkId = 'talks:the-cross' as TalkId;

describe('talk admin actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      act: () => archiveTalkAction(talkId),
      args: { talkId },
      mutation: api.talks.archiveTalk,
      name: 'archiveTalkAction',
      tags: ['clips', 'collections', 'speakers', 'talks', 'topics'],
    },
    {
      act: () => destroyTalkAction(talkId),
      args: { talkId },
      mutation: api.talks.destroyTalk,
      name: 'destroyTalkAction',
      tags: [
        'clips',
        'collections',
        'form-options',
        'speakers',
        'talks',
        'topics',
      ],
    },
    {
      act: () => updateTalkFeaturedAction(talkId, true),
      args: { featured: true, talkId },
      mutation: api.talks.updateTalk,
      name: 'updateTalkFeaturedAction',
      tags: ['collections', 'speakers', 'talks', 'topics'],
    },
  ])(
    '$name requires an admin and invalidates the talks cache',
    async ({ act, args, mutation, tags }) => {
      vi.mocked(requireAdminUser).mockResolvedValue({
        role: 'admin',
      } as AdminUser);
      vi.mocked(fetchAuthMutation).mockResolvedValue(null);

      await expect(act()).resolves.toEqual({ data: null, success: true });

      expect(requireAdminUser).toHaveBeenCalledTimes(1);
      expect(fetchAuthMutation).toHaveBeenCalledWith(mutation, args);
      expect(updateTag).toHaveBeenCalledTimes(tags.length);

      for (const tag of tags) {
        expect(updateTag).toHaveBeenCalledWith(tag);
      }
    }
  );

  it('does not invalidate the cache when archive fails', async () => {
    vi.mocked(requireAdminUser).mockResolvedValue({
      role: 'admin',
    } as AdminUser);
    vi.mocked(fetchAuthMutation).mockRejectedValue(new Error('nope'));

    await expect(archiveTalkAction(talkId)).resolves.toEqual({
      errors: { _form: USER_ERROR_MESSAGE },
      success: false,
    });
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('does not mutate when the admin check rejects', async () => {
    vi.mocked(requireAdminUser).mockRejectedValue(new Error('redirect'));

    await expect(updateTalkFeaturedAction(talkId, false)).rejects.toThrow(
      'redirect'
    );
    expect(fetchAuthMutation).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });
});
