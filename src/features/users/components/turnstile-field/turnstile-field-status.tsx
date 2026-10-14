import type { RefObject } from 'react';

import { Button, FieldError } from '@/components/ui';
import { AUTH_ERRORS } from '@/services/auth/config';

export function TurnstileFieldStatus({
  containerRef,
  onRetryScript,
  resetKey,
  scriptFailed,
  siteKey,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  onRetryScript: () => void;
  resetKey: number;
  scriptFailed: boolean;
  siteKey: string | undefined;
}) {
  if (!siteKey) {
    return (
      <FieldError match>
        Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
      </FieldError>
    );
  }

  if (scriptFailed) {
    return (
      <div className="space-y-2">
        <FieldError match>{AUTH_ERRORS.CAPTCHA_UNAVAILABLE}</FieldError>
        <Button
          onClick={onRetryScript}
          size="sm"
          type="button"
          variant="outline"
        >
          Try again
        </Button>
      </div>
    );
  }

  return <div className="w-full" key={resetKey} ref={containerRef} />;
}
