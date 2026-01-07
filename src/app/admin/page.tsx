import { PageHeader } from '@/components/page-header';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Overview of content and activity"
        title="Admin Dashboard"
        variant="lg"
      />
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        <p>Dashboard coming soon - Stats, recent activity, and quick actions</p>
      </div>
    </div>
  );
}
