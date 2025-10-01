import Link from "next/link";

function UnauthenticatedContent() {
  return (
    <div className="inline-flex items-center space-x-4">
      <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
        Not logged in
      </div>
      <div className="space-x-2">
        <Link
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          href="/login"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default UnauthenticatedContent;
