import { requireAuthUser } from '../../lib/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuthUser('/login?redirect=/account');

  return <>{children}</>;
}
