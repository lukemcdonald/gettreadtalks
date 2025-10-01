// Auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  NETWORK_ERROR: "Unable to connect. Please check your connection and try again.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  UNKNOWN_AUTH_ERROR: "Authentication failed. Please try again.",
} as const;

// Auth success messages (if needed)
export const AUTH_SUCCESS = {
  SIGN_IN: "Successfully signed in",
  SIGN_OUT: "Successfully signed out",
  SIGN_UP: "Account created successfully",
} as const;
