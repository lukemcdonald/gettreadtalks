import { describe, expect, it, vi } from '@/test';

import { openTalkForAgent, toTalkPath } from './tools';

const origin = 'https://www.gettreadtalks.com';

describe('toTalkPath', () => {
  it('accepts a same-origin talk URL, path, or speaker/talk slug', () => {
    expect(
      toTalkPath(
        'https://www.gettreadtalks.com/talks/john-doe/sample-sermon-on-romans-8',
        origin
      )
    ).toEqual({
      href: '/talks/john-doe/sample-sermon-on-romans-8',
    });
    expect(
      toTalkPath('/talks/john-doe/sample-sermon-on-romans-8', origin)
    ).toEqual({
      href: '/talks/john-doe/sample-sermon-on-romans-8',
    });
    expect(toTalkPath('john-doe/sample-sermon-on-romans-8', origin)).toEqual({
      href: '/talks/john-doe/sample-sermon-on-romans-8',
    });
  });

  it('rejects other origins and non-talk paths', () => {
    expect(toTalkPath('https://evil.example/talks/john-doe/x', origin)).toEqual(
      expect.objectContaining({ code: 'CROSS_ORIGIN' })
    );
    expect(toTalkPath('//evil.example/talks/john-doe/x', origin)).toEqual(
      expect.objectContaining({ code: 'CROSS_ORIGIN' })
    );
    expect(toTalkPath('/manage/talks', origin)).toEqual(
      expect.objectContaining({ code: 'INVALID_TALK' })
    );
    expect(toTalkPath('../manage', origin)).toEqual(
      expect.objectContaining({ code: 'INVALID_TALK' })
    );
  });
});

describe('openTalkForAgent', () => {
  it('navigates to a validated talk path', () => {
    const navigate = vi.fn();
    const result = openTalkForAgent({
      navigate,
      origin,
      talk: '/talks/john-doe/sample-sermon-on-romans-8',
    });

    expect(navigate).toHaveBeenCalledWith(
      '/talks/john-doe/sample-sermon-on-romans-8'
    );
    expect(result).toEqual({
      href: '/talks/john-doe/sample-sermon-on-romans-8',
    });
  });

  it('does not navigate for a cross-origin URL', () => {
    const navigate = vi.fn();
    const result = openTalkForAgent({
      navigate,
      origin,
      talk: 'https://evil.example/talks/john-doe/x',
    });

    expect(navigate).not.toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ code: 'CROSS_ORIGIN' }));
  });
});
