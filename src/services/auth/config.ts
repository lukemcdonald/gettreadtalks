// Auth error messages
export const AUTH_ERRORS = {
  CAPTCHA_REQUIRED: 'Please complete the verification check.',
  CAPTCHA_UNAVAILABLE:
    'Verification failed to load. Disable blockers for this page and try again.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR:
    'Unable to connect. Please check your connection and try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  RESET_EMAIL_FAILED: 'Failed to send reset email. Please try again.',
  RESET_TOKEN_INVALID:
    'This reset link is invalid or has expired. Please request a new one.',
  UNKNOWN_AUTH_ERROR: 'Authentication failed. Please try again.',
} as const;

export function hasCaptchaToken(required: boolean, token: string) {
  return !required || Boolean(token);
}

export function isTurnstileRequired() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview';
}
