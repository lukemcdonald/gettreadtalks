'use client';

import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { useEffect, useState } from 'react';

import { resetCaptchaIfNeeded } from '@/features/users/components/turnstile-field';
import {
  AUTH_ERRORS,
  hasCaptchaToken,
  isTurnstileRequired,
} from '@/services/auth/config';

export function useCaptchaField<T extends FieldValues>(form: UseFormReturn<T>) {
  const captchaRequired = isTurnstileRequired();
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    if (!captchaToken) {
      return;
    }

    form.clearErrors('root');
  }, [captchaToken, form]);

  function resetCaptcha() {
    resetCaptchaIfNeeded(captchaRequired, setCaptchaResetKey, setCaptchaToken);
  }

  return {
    captchaRequired,
    captchaResetKey,
    captchaToken,
    resetCaptcha,
    setCaptchaToken,
  };
}

export function requireCaptchaToken<T extends FieldValues>(
  form: UseFormReturn<T>,
  captcha: Pick<
    ReturnType<typeof useCaptchaField>,
    'captchaRequired' | 'captchaToken'
  >
) {
  if (hasCaptchaToken(captcha.captchaRequired, captcha.captchaToken)) {
    return true;
  }

  form.setError('root', { message: AUTH_ERRORS.CAPTCHA_REQUIRED });

  return false;
}
