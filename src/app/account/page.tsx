"use client";

import MainLayout from "@/components/layouts/main";
import { authClient } from "@/features/auth/auth.client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  email: string;
  id: string;
  name: string;
}

export default function AccountPage() {
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
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view this page.</p>
          <Link
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            href="/login"
          >
            Go to Login
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Account Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {user.name}!</p>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      User ID
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Account Status
              </h2>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="font-semibold">Account Active</p>
                <p>Your authentication is working correctly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
