'use client';

import type { RefObject } from 'react';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { Button, Field, FieldError } from '@/components/ui';
import { AUTH_ERRORS, isTurnstileRequired } from '@/services/auth/config';
import { reportUnexpectedError } from '@/services/errors';

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-api';
const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement,
    options: {
      action: string;
      callback: (token: string) => void;
      'error-callback': () => void;
      'expired-callback': () => void;
      sitekey: string;
      size: 'compact' | 'flexible' | 'normal';
      theme: 'auto' | 'dark' | 'light';
    }
  ) => string;
}

function getTurnstile(): TurnstileApi | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

function bindTurnstile({
  container,
  onTokenChange,
  resetKey,
  siteKey,
  turnstile,
}: {
  container: HTMLElement;
  onTokenChange: (token: string) => void;
  resetKey: number;
  siteKey: string;
  turnstile: TurnstileApi;
}) {
  const clearToken = () => {
    onTokenChange('');
  };

  const widgetId = turnstile.render(container, {
    action: `auth-${resetKey}`,
    callback: onTokenChange,
    'error-callback': clearToken,
    'expired-callback': clearToken,
    sitekey: siteKey,
    size: 'flexible',
    theme: 'auto',
  });

  return () => {
    turnstile.remove(widgetId);
    clearToken();
  };
}

type ScriptStatus = 'error' | 'loading' | 'ready';

interface TurnstileFieldProps {
  onTokenChange: (token: string) => void;
  resetKey: number;
}

function resetTurnstile(
  setCaptchaResetKey: (updater: (key: number) => number) => void,
  setCaptchaToken: (token: string) => void
) {
  setCaptchaResetKey((key) => key + 1);
  setCaptchaToken('');
}

export function resetCaptchaIfNeeded(
  required: boolean,
  setCaptchaResetKey: (updater: (key: number) => number) => void,
  setCaptchaToken: (token: string) => void
) {
  if (!required) {
    return;
  }

  resetTurnstile(setCaptchaResetKey, setCaptchaToken);
}

function startTurnstileWidget({
  container,
  onTokenChange,
  resetKey,
  scriptStatus,
  siteKey,
}: {
  container: HTMLDivElement | null;
  onTokenChange: (token: string) => void;
  resetKey: number;
  scriptStatus: ScriptStatus;
  siteKey: string | undefined;
}) {
  const turnstile = getTurnstile();
  const ready = [container, scriptStatus === 'ready', siteKey, turnstile].every(
    Boolean
  );

  if (!ready) {
    return;
  }

  return bindTurnstile({
    container: container as HTMLDivElement,
    onTokenChange,
    resetKey,
    siteKey: siteKey as string,
    turnstile: turnstile as TurnstileApi,
  });
}

function turnstileScriptId(retryKey: number) {
  return `${TURNSTILE_SCRIPT_ID}-${retryKey}`;
}

function retryTurnstileScript({
  retryKey,
  setScriptRetryKey,
  setScriptStatus,
}: {
  retryKey: number;
  setScriptRetryKey: (updater: (key: number) => number) => void;
  setScriptStatus: (status: ScriptStatus) => void;
}) {
  document
    .querySelector(`#${CSS.escape(turnstileScriptId(retryKey))}`)
    ?.remove();
  delete (window as Window & { turnstile?: TurnstileApi }).turnstile;
  setScriptStatus('loading');
  setScriptRetryKey((key) => key + 1);
}

function TurnstileFieldStatus({
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

export function TurnstileField({
  onTokenChange,
  resetKey,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [scriptRetryKey, setScriptRetryKey] = useState(0);
  const [scriptStatus, setScriptStatus] = useState<ScriptStatus>('loading');

  useEffect(
    () =>
      startTurnstileWidget({
        container: containerRef.current,
        onTokenChange,
        resetKey,
        scriptStatus,
        siteKey,
      }),
    [onTokenChange, resetKey, scriptStatus, siteKey]
  );

  useEffect(() => {
    if (siteKey || !isTurnstileRequired()) {
      return;
    }

    reportUnexpectedError(
      new Error(
        'Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.'
      ),
      {
        fingerprint: ['config', 'turnstile-site-key'],
      }
    );
  }, [siteKey]);

  if (!isTurnstileRequired()) {
    return null;
  }

  return (
    <Field invalid={!siteKey || scriptStatus === 'error'}>
      <Script
        id={turnstileScriptId(scriptRetryKey)}
        key={scriptRetryKey}
        onError={() => {
          setScriptStatus('error');
        }}
        onReady={() => {
          setScriptStatus('ready');
        }}
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
      />
      <TurnstileFieldStatus
        containerRef={containerRef}
        onRetryScript={() => {
          retryTurnstileScript({
            retryKey: scriptRetryKey,
            setScriptRetryKey,
            setScriptStatus,
          });
        }}
        resetKey={resetKey}
        scriptStatus={scriptStatus}
        siteKey={siteKey}
      />
    </Field>
  );
}
