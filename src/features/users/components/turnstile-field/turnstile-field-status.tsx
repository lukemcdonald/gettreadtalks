import type { ScriptStatus } from './turnstile-api';
import type { RefObject } from 'react';

import { Button, FieldError } from '@/components/ui';
import { AUTH_ERRORS } from '@/services/auth/config';

export function TurnstileFieldStatus({
  containerRef,
  onRetryScript,
  resetKey,
  scriptStatus,
  siteKey,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  onRetryScript: () => void;
  resetKey: number;
  scriptStatus: ScriptStatus;
  siteKey: string | undefined;
}) {
  if (!siteKey) {
    return (
      <FieldError match>{AUTH_ERRORS.VERIFICATION_UNAVAILABLE}</FieldError>
    );
  }

  if (scriptStatus === 'error') {
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
