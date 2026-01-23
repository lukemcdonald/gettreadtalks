import { redirect } from 'next/navigation';

/** Hard navigation fallback - redirect to speakers page */
export default function CreateSpeakerPage() {
  redirect('/speakers');
}
