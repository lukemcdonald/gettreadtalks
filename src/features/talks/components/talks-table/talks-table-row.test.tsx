/// <reference types="vitest/globals" />

import type { Speaker } from '@/features/speakers/types';
import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { Table, TableBody } from '@/components/ui';
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
      collectionTitle: 'Romans',
      featured: true,
      featuredClipTitle: 'Grace Clip',
      scripture: 'Romans 3:21-26',
      slug: 'justification',
      speaker,
      status: 'published',
      title: 'Justification',
      topicSlugs: ['justification', 'grace'],
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

  it('opens the edit drawer from the title and has no pencil control', () => {
    const talk = createTalk();
    setup(talk);
    const titleLink = screen.getByRole('link', { name: talk.title });

    expect(titleLink).toHaveAttribute(
      'href',
      getEntityEditPath('talks', talk._id)
    );
    expect(titleLink).not.toHaveAttribute('href', '');
    expect(
      screen.queryByRole('link', { name: `Edit ${talk.title}` })
    ).not.toBeInTheDocument();
    expect(screen.getByText('John Piper')).toBeVisible();
    expect(screen.queryByText('Romans 3:21-26')).not.toBeInTheDocument();
  });

  it('shows extra talk details on title hover', async () => {
    const talk = createTalk();
    const { hover } = setup(talk);

    await hover(screen.getByRole('link', { name: talk.title }));

    expect(await screen.findByText('Romans 3:21-26')).toBeVisible();
    expect(screen.getByText('justification, grace')).toBeVisible();
    expect(screen.getByText('Romans')).toBeVisible();
    expect(screen.getByText('Grace Clip')).toBeVisible();
  });

  it('still opens the edit drawer from an unpublished title', () => {
    const talk = createTalk({ status: 'backlog' });
    setup(talk);

    expect(screen.getByRole('link', { name: talk.title })).toHaveAttribute(
      'href',
      getEntityEditPath('talks', talk._id)
    );
  });
});
