/**
 * Debug page to test environment detection
 * TODO: Remove this file after confirming Sentry environment detection is working
 */

export default function DebugEnvPage() {
  // These will be evaluated at build time for server-side
  const serverEnv = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL: process.env.VERCEL,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Debug</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Server Environment Variables</h2>
          <pre className="text-sm">{JSON.stringify(serverEnv, null, 2)}</pre>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Expected Results</h2>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Local development:</strong> NODE_ENV=development, VERCEL_ENV=undefined,
              VERCEL=undefined
            </li>
            <li>
              <strong>Vercel preview:</strong> NODE_ENV=production, VERCEL_ENV=preview, VERCEL=1
            </li>
            <li>
              <strong>Vercel production:</strong> NODE_ENV=production, VERCEL_ENV=production,
              VERCEL=1
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Standardized Sentry Environment Detection</h2>
          <p className="text-sm">
            Based on these values, your Sentry environment should now show standardized values:
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <strong>Local:</strong> "local"
            </li>
            <li>
              <strong>Preview:</strong> "dev"
            </li>
            <li>
              <strong>Production:</strong> "prod"
            </li>
          </ul>
          <p className="text-sm mt-2 font-medium">
            This should eliminate the multiple environment issue in Sentry!
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Deploy this change to production</li>
            <li>Trigger a Sentry error on production</li>
            <li>
              Check Sentry dashboard - environment should now show "prod" instead of multiple values
            </li>
            <li>Delete this debug page once confirmed working</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
