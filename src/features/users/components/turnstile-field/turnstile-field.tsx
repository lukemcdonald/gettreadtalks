'use client';

import type { ScriptStatus } from './turnstile-api';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { Field } from '@/components/ui';
import { isTurnstileRequired } from '@/services/auth/config';
import { reportUnexpectedError } from '@/services/errors';

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
