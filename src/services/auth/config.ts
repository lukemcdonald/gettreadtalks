// Auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Unable to connect. Please check your connection and try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  RESET_EMAIL_FAILED: 'Failed to send reset email. Please try again.',
  RESET_TOKEN_INVALID: 'This reset link is invalid or has expired. Please request a new one.',
  UNKNOWN_AUTH_ERROR: 'Authentication failed. Please try again.',
} as const;

// Auth success messages (if needed)
export const AUTH_SUCCESS = {
  SIGN_IN: 'Successfully signed in',
  SIGN_OUT: 'Successfully signed out',
  SIGN_UP: 'Account created successfully',
} as const;
