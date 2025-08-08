"use client";

import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import PasswordSettings from './PasswordSettings';
import TwoFactorAuth from './TwoFactorAuth';
import SessionManager from './SessionManager';
import { User, Key, Shield, LogOut } from 'lucide-react';

type Tab = 'profile' | 'password' | 'security' | 'sessions';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'password':
        return <PasswordSettings />;
      case 'security':
        return <TwoFactorAuth />;
      case 'sessions':
        return <SessionManager />;
      default:
        return <ProfileSettings />;
    }
  };

  const TabButton = ({ tabName, currentTab, setTab, icon: Icon, children }: any) => (
    <button
      onClick={() => setTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${
        currentTab === tabName
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-white'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );

  return (
    <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
      <div className="md:flex">
        <div className="md:w-1/4">
          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            Account Settings
          </h2>
          <nav className="flex flex-col mt-6 space-y-1">
            <TabButton tabName="profile" currentTab={activeTab} setTab={setActiveTab} icon={User}>
              Profile
            </TabButton>
            <TabButton tabName="password" currentTab={activeTab} setTab={setActiveTab} icon={Key}>
              Password
            </TabButton>
            <TabButton tabName="security" currentTab={activeTab} setTab={setActiveTab} icon={Shield}>
              Two-Factor Auth
            </TabButton>
            <TabButton tabName="sessions" currentTab={activeTab} setTab={setActiveTab} icon={LogOut}>
              Active Sessions
            </TabButton>
          </nav>
        </div>
        <div className="mt-8 md:mt-0 md:w-3/4 md:pl-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}