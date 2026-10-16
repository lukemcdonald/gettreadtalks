/// <reference types="vitest/globals" />

import type { AdminClip } from '@/features/clips/types';

import { Table, TableBody } from '@/components/ui';
import { buildEntityEditPath } from '@/lib/entities/paths';
import { describe, expect, it, render, screen } from '@/test';

import { ClipsTableRow } from './clips-table-row';

vi.mock('@/features/clips/components/clip-actions-menu', () => ({
  ClipActionsMenu: () => null,
}));

describe('ClipsTableRow', () => {
  function createClip(overrides: Partial<AdminClip> = {}): AdminClip {
    return {
      _creationTime: 1,
      _id: 'clips:grace' as AdminClip['_id'],
      mediaUrl: 'https://example.com/clip',
      slug: 'grace-clip',
      speaker: {
        _creationTime: 1,
        _id: 'speakers:john-piper' as NonNullable<AdminClip['speaker']>['_id'],
        firstName: 'John',
        lastName: 'Piper',
        slug: 'john-piper',
      },
      status: 'published',
      talkTitle: 'Grace Abounding',
      title: 'Grace Clip',
      ...overrides,
    } as AdminClip;
  }

  function setup(clip: AdminClip) {
    return render(
      <Table>
        <TableBody>
          <ClipsTableRow clip={clip} />
        </TableBody>
      </Table>
    );
  }

  it('opens the edit drawer from the title and shows the talk underneath', () => {
    const clip = createClip();
    setup(clip);

    expect(screen.getByRole('link', { name: clip.title })).toHaveAttribute(
      'href',
      buildEntityEditPath('clips', clip._id)
    );
    expect(screen.getByText('Grace Abounding')).toBeVisible();
    expect(
      screen.queryByRole('link', { name: `Edit ${clip.title}` })
    ).not.toBeInTheDocument();
  });
});
