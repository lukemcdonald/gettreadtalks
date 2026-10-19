/// <reference types="vitest/globals" />

import type { MediaCheckId } from '../types';

import { ManageTable } from '@/components/manage-table';
import { PageHeader } from '@/components/page-header';
import { describe, expect, it, render, screen } from '@/test';

import { MediaHealthTableRow } from './media-health-table-row';

vi.mock('@/components/ui/primitives/toast', () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

vi.mock('@/features/media-health/actions/ignore-media-check', () => ({
  ignoreMediaCheckAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('MediaHealthTableRow', () => {
  it('shows the open item and Ignore action', () => {
    render(
      <div data-testid="media-health-view">
        <PageHeader
          description="Open private or missing talk and clip media. Ignore keeps an item out of the digest until its URL changes."
          title="Media health"
        />
        <ManageTable isEmpty={false} resource="media">
          <MediaHealthTableRow
            item={{
              _id: 'mediaChecks:open1' as MediaCheckId,
              adminPath: '/manage/talks/talk123',
              firstBrokenAt: Date.UTC(2026, 9, 1),
              mediaUrl: 'https://youtu.be/0SVTl4Xa5fY',
              publicPath: '/talks/john-bunyan/grace-abounding',
              status: 'private',
              title: 'Grace Abounding',
            }}
          />
        </ManageTable>
      </div>
    );

    expect(screen.getByRole('heading', { name: 'Media health' })).toBeVisible();
    expect(screen.getByText('Grace Abounding')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Ignore' })).toBeVisible();
  });
});
