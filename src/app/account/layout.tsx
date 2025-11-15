import { requireCurrentUser } from '../../lib/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentUser('/login?redirect=/account');

  return <>{children}</>;
}
