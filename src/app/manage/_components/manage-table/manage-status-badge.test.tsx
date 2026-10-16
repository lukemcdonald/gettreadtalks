import { describe, expect, it, render, screen } from '@/test';

import { ManageStatusBadge, ManageStatusDot } from './manage-status-badge';

describe('ManageStatusBadge', () => {
  it('labels published, draft, and archived with an outline badge', () => {
    const { rerender } = render(<ManageStatusBadge status="published" />);

    expect(screen.getByText('Published')).toBeVisible();

    rerender(<ManageStatusBadge status="backlog" />);
    expect(screen.getByText('Draft')).toBeVisible();

    rerender(<ManageStatusBadge status="archived" />);
    expect(screen.getByText('Archived')).toBeVisible();
  });
});

describe('ManageStatusDot', () => {
  it('exposes the status name for assistive tech', () => {
    render(<ManageStatusDot status="published" />);

    expect(screen.getByLabelText('Published')).toBeInTheDocument();
  });
});
