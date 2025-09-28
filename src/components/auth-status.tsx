"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  email: string;
  id: string;
  name: string;
}

export default function AuthStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (session.data?.user) {
        setUser(session.data.user as User);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
        <span className="animate-spin text-blue-500 mr-2">⚪</span>
        <span className="text-gray-600 dark:text-gray-300">Checking auth...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="inline-flex items-center space-x-4">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
          <span className="text-green-500 mr-2">✅</span>
          <span className="font-medium">Logged in as {user.name}</span>
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
  }

  return (
    <div className="inline-flex items-center space-x-4">
      <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
        <span className="text-yellow-500 mr-2">🔐</span>
        <span>Not logged in</span>
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
