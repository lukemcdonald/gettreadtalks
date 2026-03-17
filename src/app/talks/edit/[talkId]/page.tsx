// Fallback for direct URL access. The edit UI is modal-only via @sheet/(.)talks/edit.
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/account/talks');
}
