// Fallback for direct URL access. The edit UI is modal-only via @sheet/(.)speakers/edit.
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/speakers');
}
