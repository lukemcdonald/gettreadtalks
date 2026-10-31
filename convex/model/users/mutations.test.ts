import { describe, expect, it } from 'vitest';

import { api, components } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import { createConvexTest, signInAsPasswordUser } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';
import { insertUserFavoriteTalk } from './test.factory';

const PASSWORD = 'correct-horse-battery';

describe('users.deleteUser', () => {
  it('deletes a password user and owned rows', async () => {
    const t = createConvexTest();
    const { asUser, userId } = await signInAsPasswordUser(t, {
      email: 'luke@example.test',
      name: 'Luke',
      password: PASSWORD,
      role: 'user',
    });
    const talkId = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);
      const createdTalkId = await insertTalk(ctx, { speakerId });
      await insertUserFavoriteTalk(ctx, {
        talkId: createdTalkId,
        userId,
      });

      return createdTalkId;
    });

    await asUser.mutation(api.users.deleteUser, { password: PASSWORD });

    const leftover = await t.run(async (ctx) => {
      const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
        model: 'user',
        where: [{ field: '_id', value: userId }],
      });
      const account = await ctx.runQuery(
        components.betterAuth.adapter.findOne,
        {
          model: 'account',
          where: [{ field: 'userId', value: userId }],
        }
      );
      const favorite = await ctx.db
        .query('userFavoriteTalks')
        .withIndex('by_userId_and_talkId', (q) =>
          q.eq('userId', userId).eq('talkId', talkId)
        )
        .first();
      const talk = await ctx.db.get('talks', talkId);
      const speaker = talk
        ? await ctx.db.get('speakers', talk.speakerId)
        : null;

      return { account, favorite, speaker, talk, user };
    });

    expect(leftover.user).toBe(null);
    expect(leftover.account).toBe(null);
    expect(leftover.favorite).toBe(null);
    expect(leftover.talk).not.toBe(null);
    expect(leftover.speaker).not.toBe(null);
  });

  it('rejects the wrong password without deleting the user', async () => {
    const t = createConvexTest();
    const { asUser, userId } = await signInAsPasswordUser(t, {
      email: 'luke@example.test',
      name: 'Luke',
      password: PASSWORD,
      role: 'user',
    });

    await expect(
      asUser.mutation(api.users.deleteUser, { password: 'wrong-password' })
    ).rejects.toMatchObject({
      data: {
        errorCode: ErrorCodes.VALIDATION_FAILED,
        field: 'password',
        message: 'Check your password and try again.',
      },
    });

    const user = await t.run(
      async (ctx) =>
        await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: 'user',
          where: [{ field: '_id', value: userId }],
        })
    );

    expect(user).not.toBe(null);
  });
});
