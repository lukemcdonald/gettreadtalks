import { sha256 } from 'js-sha256';

const BASE_URL = 'https://gravatar.com/avatar';
const DEFAULT_SIZE = 80;
const DEFAULT_IMAGE = '404';

interface GravatarProps {
  default?: string;
  email: string | null | undefined;
  size?: number;
}

/**
 * Generate a Gravatar URL for an email address using SHA256 hash.
 * Follows Gravatar API v3.0.0 specifications.
 *
 * @param default - The default image to use if no Gravatar exists (default: '404')
 * @param email - The user's email address
 * @param size - The size of the avatar in pixels (default: 80)
 * @returns Gravatar URL or null if email is not provided
 *
 * @remarks
 * Defaults to '404' so Gravatar returns 404 when no avatar exists, allowing
 * the Avatar component's fallback to display.
 */
export function getGravatarUrl({
  default: defaultImage = DEFAULT_IMAGE,
  email,
  size = DEFAULT_SIZE,
}: GravatarProps): string | null {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailHash = sha256(normalizedEmail);

  return `${BASE_URL}/${emailHash}?s=${size}&d=${defaultImage}`;
}
