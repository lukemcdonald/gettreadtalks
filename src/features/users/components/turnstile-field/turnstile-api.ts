import { TURNSTILE_SCRIPT_ID } from './constants';

export type ScriptStatus = 'error' | 'loading' | 'ready';

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

export function startTurnstileWidget({
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

export function turnstileScriptId(retryKey: number) {
  return `${TURNSTILE_SCRIPT_ID}-${retryKey}`;
}

export function retryTurnstileScript({
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
