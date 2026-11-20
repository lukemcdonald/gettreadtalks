/// <reference types="vitest/globals" />

import type { ClipId } from '@/features/clips/types';
import type { AdminUser } from '@/services/auth/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';
import { beforeEach, describe, expect, it } from '@/test';

import { archiveClipAction } from './archive-clip';
import { destroyClipAction } from './destroy-clip';

vi.mock('next/cache', () => ({
  updateTag: vi.fn(),
}));

vi.mock('@/services/auth/server', () => ({
  fetchAuthMutation: vi.fn(),
  requireAdminUser: vi.fn(),
}));

const clipId = 'clips:grace' as ClipId;

describe('clip admin actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      act: () => archiveClipAction(clipId),
      args: { clipId },
      mutation: api.clips.archiveClip,
      name: 'archiveClipAction',
    },
    {
      act: () => destroyClipAction(clipId),
      args: { clipId },
      mutation: api.clips.destroyClip,
      name: 'destroyClipAction',
    },
  ])(
    '$name requires an admin and invalidates the clips cache',
    async ({ act, args, mutation }) => {
      vi.mocked(requireAdminUser).mockResolvedValue({
        role: 'admin',
      } as AdminUser);
      vi.mocked(fetchAuthMutation).mockResolvedValue(null);

      await expect(act()).resolves.toEqual({ data: null, success: true });

      expect(requireAdminUser).toHaveBeenCalledTimes(1);
      expect(fetchAuthMutation).toHaveBeenCalledWith(mutation, args);
      expect(updateTag).toHaveBeenCalledTimes(1);
      expect(updateTag).toHaveBeenCalledWith('clips');
    }
  );

  it('does not invalidate the cache when destroy fails', async () => {
    vi.mocked(requireAdminUser).mockResolvedValue({
      role: 'admin',
    } as AdminUser);
    vi.mocked(fetchAuthMutation).mockRejectedValue(new Error('nope'));

    await expect(destroyClipAction(clipId)).resolves.toEqual({
      errors: { _form: USER_ERROR_MESSAGE },
      success: false,
    });
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('does not mutate when the admin check rejects', async () => {
    vi.mocked(requireAdminUser).mockRejectedValue(new Error('redirect'));

    await expect(archiveClipAction(clipId)).rejects.toThrow('redirect');
    expect(fetchAuthMutation).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });
});
