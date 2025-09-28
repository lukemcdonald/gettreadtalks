import AuthStatus from "@/components/auth-status";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
          <h1>
            TREAD<span className="text-blue-600">Talks</span>
          </h1>
          <AuthStatus />
        </header>

        <main className="max-w-4xl mx-auto space-y-12">
          <nav className="space-x-4">
            <Link href="/login">Login / Register</Link>
            <Link href="/account">Account Dashboard</Link>
          </nav>
        </main>
      </div>
    </div>
  );
}
