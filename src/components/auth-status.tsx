"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { authClient } from "@/features/auth/auth.client";
import Link from "next/link";
import { api } from "@convex/_generated/api";

export default function AuthStatus() {
  return (
    <>
      <AuthLoading>
        <div className="inline-flex gap-2 items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <span>⚪</span>
          <span className="text-gray-600 dark:text-gray-300">Checking auth...</span>
        </div>
      </AuthLoading>

      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </>
  );
}

const AuthenticatedContent = () => {
  const user = useQuery(api.auth.getCurrentUser);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="inline-flex items-center space-x-4">
      <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
        {user?.name || "User"}
      </div>
      <div className="space-x-2">
        <Link
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          href="/account"
        >
          Account
        </Link>
        <button
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const UnauthenticatedContent = () => (
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
