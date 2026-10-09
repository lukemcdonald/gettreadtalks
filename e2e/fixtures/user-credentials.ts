export const E2E_USER_SKIP_REASON =
  'E2E_USER_EMAIL and E2E_USER_PASSWORD are not set';

export const USER_STORAGE_STATE = 'playwright/.auth/user.json';

export function getE2eUser() {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!(email && password)) {
    return;
  }

  return { email, password };
}

export function hasE2eUser() {
  return Boolean(getE2eUser());
}
