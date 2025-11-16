export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto px-4 py-12">
      <main className="mx-auto max-w-4xl space-y-12">{children}</main>
    </div>
  );
}
