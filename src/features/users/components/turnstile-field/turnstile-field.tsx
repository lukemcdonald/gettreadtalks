'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { Field } from '@/components/ui';
import { isTurnstileRequired } from '@/services/auth/config';

import { TURNSTILE_SCRIPT_SRC } from './constants';
import {
  retryTurnstileScript,
  startTurnstileWidget,
  turnstileScriptId,
} from './turnstile-api';
import { TurnstileFieldStatus } from './turnstile-field-status';

interface TurnstileFieldProps {
  onTokenChange: (token: string) => void;
  resetKey: number;
}

export function TurnstileField({
  onTokenChange,
  resetKey,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [scriptFailed, setScriptFailed] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptRetryKey, setScriptRetryKey] = useState(0);

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

  if (!isTurnstileRequired()) {
    return null;
  }

  return (
    <Field invalid={!siteKey || scriptFailed}>
      <Script
        id={turnstileScriptId(scriptRetryKey)}
        key={scriptRetryKey}
        onError={() => {
          setScriptFailed(true);
          setScriptReady(false);
        }}
        onReady={() => {
          setScriptFailed(false);
          setScriptReady(true);
        }}
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
      />
      <TurnstileFieldStatus
        containerRef={containerRef}
        onRetryScript={() => {
          retryTurnstileScript({
            retryKey: scriptRetryKey,
            setScriptFailed,
            setScriptReady,
            setScriptRetryKey,
          });
        }}
        resetKey={resetKey}
        scriptFailed={scriptFailed}
        siteKey={siteKey}
      />
    </Field>
  );
}
