export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <main className="max-w-4xl mx-auto space-y-12">{children}</main>
    </div>
  );
}
