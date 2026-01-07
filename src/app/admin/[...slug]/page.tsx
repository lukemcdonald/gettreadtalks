import { redirect } from 'next/navigation';

type AdminCatchAllPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function AdminCatchAllPage({ params }: AdminCatchAllPageProps) {
  const { slug } = await params;
  redirect(`/account/${slug.join('/')}`);
}
