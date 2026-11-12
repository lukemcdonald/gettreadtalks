/// <reference types="vitest/globals" />

import SpeakersPage from '@/app/speakers/page';
import { describe, expect, it, render, screen } from '@/test';

const { loadSpeakerRolesMock } = vi.hoisted(() => ({
  loadSpeakerRolesMock: vi.fn(),
}));

vi.mock('@/features/speakers/queries/load-speaker-roles', () => ({
  loadSpeakerRoles: loadSpeakerRolesMock,
}));

vi.mock('@/app/speakers/_components/speakers-results', () => ({
  SpeakersResults: () => null,
}));

vi.mock('@/app/speakers/_components/speakers-sidebar', () => ({
  SpeakersSidebar: ({ roles }: { roles: string[] }) => (
    <div>
      {roles.map((role) => (
        <span key={role}>{role}</span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/skeletons', () => ({
  SidebarFiltersSkeleton: () => null,
}));

vi.mock('@/features/speakers/components/speakers-list-skeleton', () => ({
  SpeakersListSkeleton: () => null,
}));

describe('SpeakersPage', () => {
  it('shows the published total and every in-use role', async () => {
    loadSpeakerRolesMock.mockResolvedValue({
      count: 26,
      roles: ['Author', 'Pastor', 'Theologian'],
    });

    render(await SpeakersPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByText(
        'Listen to 26 faithful ambassadors of Christ and be blessed.'
      )
    ).toBeVisible();
    expect(screen.getByText('Author')).toBeVisible();
    expect(screen.getByText('Theologian')).toBeVisible();
  });
});
