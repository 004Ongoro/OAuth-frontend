"use client";

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";

import Avatar from '@/app/components/Avatar';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
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
            <Avatar name={user.name || user.email} src={user.profilePicture} />
            <div className="ml-4">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Roles:</span> {user.roles.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}