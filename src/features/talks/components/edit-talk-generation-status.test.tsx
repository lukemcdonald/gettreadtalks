import { describe, expect, it, render, screen } from '@/test';

import { TalkGenerationStatusList } from './edit-talk-generation-status';

describe('TalkGenerationStatusList', () => {
  it('exposes each stage through test ids and data-state', () => {
    render(
      <TalkGenerationStatusList
        stages={{
          study: { kind: 'waiting' },
          summary: { kind: 'generating' },
          transcript: { kind: 'fetching' },
        }}
      />
    );

    expect(screen.getByTestId('talk-generation-status')).toHaveAttribute(
      'aria-live',
      'polite'
    );
    expect(
      screen.getByTestId('talk-generation-status-transcript')
    ).toHaveAttribute('data-state', 'fetching');
    expect(
      screen.getByTestId('talk-generation-status-summary')
    ).toHaveAttribute('data-state', 'generating');
    expect(screen.getByTestId('talk-generation-status-study')).toHaveAttribute(
      'data-state',
      'waiting'
    );
  });

  it('includes the failure detail without a pending sentinel', () => {
    render(
      <TalkGenerationStatusList
        stages={{
          study: { kind: 'missing' },
          summary: {
            kind: 'failed',
            message: 'Summary service returned an error.',
          },
          transcript: { kind: 'ready' },
        }}
      />
    );

    expect(
      screen.getByTestId('talk-generation-status-summary')
    ).toHaveAttribute('data-state', 'failed');
    expect(
      screen.getByTestId('talk-generation-status-summary')
    ).toHaveTextContent('Summary service returned an error.');
    expect(screen.queryByText('pending')).not.toBeInTheDocument();
  });
});
