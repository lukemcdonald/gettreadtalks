// Server Component - can access all environment variables
import { getEnvironmentStatus } from "@/lib/env-validation";

export default function EnvStatus() {
  const { missing, optionalMissing, ready } = getEnvironmentStatus();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {ready ? (
            <span className="text-green-600">✅</span>
          ) : (
            <span className="text-red-600">⚠️</span>
          )}
          Environment Status
        </h2>

        {ready ? (
          <div className="text-green-700 dark:text-green-400">
            <p className="font-medium">🎉 All required environment variables are configured!</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Your TREADTalks app is ready for development.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-red-700 dark:text-red-400">
              <p className="font-medium mb-2">Missing Required Variables:</p>
              <ul className="list-disc list-inside space-y-1 text-sm font-mono">
                {missing.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {optionalMissing.length > 0 && (
          <div className="mt-4 text-yellow-700 dark:text-yellow-400">
            <p className="font-medium mb-2">Optional Variables (for full features):</p>
            <ul className="list-disc list-inside space-y-1 text-sm font-mono">
              {optionalMissing.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Next steps:</strong>
          </p>
          <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
            <li>
              Copy <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.example</code>{" "}
              to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code>
            </li>
            <li>Fill in the required environment variables</li>
            <li>
              Run <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">pnpm dev</code> and{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">pnpm convex dev</code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
