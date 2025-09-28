import AuthStatus from "@/components/auth-status";
import EnvStatus from "@/components/env-status";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            TREAD<span className="text-blue-600">Talks</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Faith-based talks and content platform
          </p>
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              <span className="text-green-500 mr-2">✅</span>
              Next.js + Convex + Better Auth Setup Complete
            </div>
            <div>
              <AuthStatus />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto space-y-12">
          <EnvStatus />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                🔒 Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Better Auth is working perfectly! Create an account or login to access personalized
                features.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div>• Email/password authentication</div>
                <div>• Secure session management</div>
                <div>• Account dashboard</div>
                <div>• User preferences & favorites</div>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  href="/login"
                >
                  Login / Register
                </Link>
                <Link
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  href="/account"
                >
                  Account Dashboard
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                🗄️ Database
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Convex backend is ready with schema for talks, speakers, and more.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div>• Speakers & Collections</div>
                <div>• Talks & Clips</div>
                <div>• Topics & User Favorites</div>
                <div>• Affiliate Links</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Next Steps
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">1️⃣</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Configure environment variables in{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env.local</code>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">2️⃣</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Run{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">pnpm convex dev</code>{" "}
                  to start backend
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">3️⃣</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Begin building your content platform
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, Convex, and Better Auth</p>
        </footer>
      </div>
    </div>
  );
}
