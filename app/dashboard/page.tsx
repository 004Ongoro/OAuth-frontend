"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  name?: string;
  email?: string;
  profilePicture?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
        // If token is invalid or expired, redirect to login
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src="/neontek-logo.png"
                  alt="NeonTek logo"
                  width={140}
                  height={30}
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              Dashboard
            </h1>
            {user && (
              <div className="mt-6">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Welcome back,{" "}
                  <span className="font-semibold">{user.name || user.email}!</span>
                </p>
                <div className="flex items-center mt-4">
                  {user.profilePicture && (
                    <Image
                      src={user.profilePicture}
                      alt="Profile picture"
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div className="ml-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}