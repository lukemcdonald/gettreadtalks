'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { Field, FieldError } from '@/components/ui';

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

interface TurnstileFieldProps {
  onTokenChange: (token: string) => void;
  resetKey: number;
}

export function resetTurnstile(
  setCaptchaResetKey: (updater: (key: number) => number) => void,
  setCaptchaToken: (token: string) => void
) {
  setCaptchaResetKey((key) => key + 1);
  setCaptchaToken('');
}

function startTurnstileWidget({
  container,
  onTokenChange,
  resetKey,
  scriptReady,
  siteKey,
}: {
  container: HTMLDivElement | null;
  onTokenChange: (token: string) => void;
  resetKey: number;
  scriptReady: boolean;
  siteKey: string | undefined;
}) {
  const turnstile = getTurnstile();
  const ready = [container, scriptReady, siteKey, turnstile].every(Boolean);

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

export function TurnstileField({
  onTokenChange,
  resetKey,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(
    () =>
      startTurnstileWidget({
        container: containerRef.current,
        onTokenChange,
        resetKey,
        scriptReady,
        siteKey,
      }),
    [onTokenChange, resetKey, scriptReady, siteKey]
  );

  return (
    <Field invalid={!siteKey}>
      <Script
        id={TURNSTILE_SCRIPT_ID}
        onReady={() => {
          setScriptReady(true);
        }}
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
      />
      {siteKey ? (
        <div className="w-full" key={resetKey} ref={containerRef} />
      ) : (
        <FieldError match>
          Verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
        </FieldError>
      )}
    </Field>
  );
}
