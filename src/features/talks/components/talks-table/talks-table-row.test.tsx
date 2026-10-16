/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';
import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { Table, TableBody } from '@/components/ui';
import { getTalkUrl } from '@/features/talks/utils';
import { getEntityEditPath } from '@/lib/entities/paths';
import { describe, expect, it, render, screen } from '@/test';

import { TalksTableRow } from './talks-table-row';

vi.mock('@/features/talks/components/talk-actions-menu', () => ({
  TalkActionsMenu: () => null,
}));

describe('TalksTableRow', () => {
  const speaker = {
    _id: 'speakers:john-piper' as Speaker['_id'],
    firstName: 'John',
    lastName: 'Piper',
    slug: 'john-piper',
  } as Speaker;

  function createTalk(
    overrides: Partial<TalkWithSpeakerAndTopics> = {}
  ): TalkWithSpeakerAndTopics {
    return {
      _creationTime: 1,
      _id: 'talks:justification' as TalkWithSpeakerAndTopics['_id'],
      slug: 'justification',
      speaker,
      status: 'published',
      title: 'Justification',
      topicSlugs: [],
      ...overrides,
    } as TalkWithSpeakerAndTopics;
  }

  function setup(talk: TalkWithSpeakerAndTopics) {
    return render(
      <Table>
        <TableBody>
          <TalksTableRow talk={talk} />
        </TableBody>
      </Table>
    );
  }

  it('links a published title to the public page', () => {
    const talk = createTalk();
    setup(talk);

    expect(screen.getByRole('link', { name: talk.title })).toHaveAttribute(
      'href',
      getTalkUrl(speaker.slug, talk.slug)
    );
    expect(
      screen.getByRole('link', { name: `Edit ${talk.title}` })
    ).toHaveAttribute('href', getEntityEditPath('talks', talk._id));
  });

  it('opens the edit drawer from an unpublished title', () => {
    const talk = createTalk({ status: 'backlog' });
    setup(talk);

    expect(screen.getByRole('link', { name: talk.title })).toHaveAttribute(
      'href',
      getEntityEditPath('talks', talk._id)
    );
  });

  it('does not use an empty href when the talk has no speaker', () => {
    const talk = createTalk({ speaker: null, status: 'published' });
    setup(talk);
    const titleLink = screen.getByRole('link', { name: talk.title });

    expect(titleLink).toHaveAttribute(
      'href',
      getEntityEditPath('talks', talk._id)
    );
    expect(titleLink).not.toHaveAttribute('href', '');
  });
});
