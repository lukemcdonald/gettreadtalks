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
