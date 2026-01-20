import { redirect } from 'next/navigation';

interface AdminCatchAllPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function AdminCatchAllPage({ params }: AdminCatchAllPageProps) {
  const { slug } = await params;
  redirect(`/account/${slug.join('/')}`);
}
