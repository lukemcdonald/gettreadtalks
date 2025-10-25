import { requireAuthUser } from '@/lib/services/auth/server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Protect all account routes - redirects to login if not authenticated
  await requireAuthUser();

  return <>{children}</>;
}
