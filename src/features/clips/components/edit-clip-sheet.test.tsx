/// <reference types="vitest/globals" />

import type { ClipId } from '@/features/clips/types';

import { describe, expect, it, render, screen } from '@/test';

import { EditClipSheet } from './edit-clip-sheet';

const { updateClipAction } = vi.hoisted(() => ({
  updateClipAction: vi.fn(),
}));

vi.mock('@/features/clips/actions/update-clip', () => ({
  updateClipAction,
}));

const clip = {
  _id: 'clips:grace' as ClipId,
  mediaUrl: 'https://example.com/clip.mp4',
  status: 'published' as const,
  title: 'Grace',
};

function renderSheet(status?: 'archived') {
  return render(
    <EditClipSheet
      clip={clip}
      onClipUpdated={vi.fn()}
      onOpenChange={vi.fn()}
      open
      speakers={[]}
      statusPrefill={status}
      talks={[]}
    />
  );
}

describe('EditClipSheet status pre-fill', () => {
  it('shows an unsaved archived status and saves it', async () => {
    updateClipAction.mockResolvedValue({
      data: { clipId: clip._id },
      success: true,
    });

    const { click } = renderSheet('archived');

    expect(screen.getByTestId('unsaved-status-notice')).toHaveTextContent(
      'Status was pre-filled as Archived and is not saved until you press Save.'
    );
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'Archived'
    );

    await click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(updateClipAction).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'archived' }),
      clip._id
    );
  });

  it('hides the notice when the clip is already archived', () => {
    render(
      <EditClipSheet
        clip={{ ...clip, status: 'archived' }}
        onClipUpdated={vi.fn()}
        onOpenChange={vi.fn()}
        open
        speakers={[]}
        statusPrefill="archived"
        talks={[]}
      />
    );

    expect(
      screen.queryByTestId('unsaved-status-notice')
    ).not.toBeInTheDocument();
  });

  it('does not save when the sheet closes', async () => {
    const onOpenChange = vi.fn();
    const { click } = render(
      <EditClipSheet
        clip={clip}
        onClipUpdated={vi.fn()}
        onOpenChange={onOpenChange}
        open
        speakers={[]}
        statusPrefill="archived"
        talks={[]}
      />
    );

    await click(screen.getByRole('button', { name: 'Cancel' }));

    expect(updateClipAction).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
