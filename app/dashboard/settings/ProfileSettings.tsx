"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import api from '@/lib/api';
import Avatar from '@/app/components/Avatar';

export default function ProfileSettings() {
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    givenName: '',
    familyName: '',
    profilePicture: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        givenName: user.givenName || '',
        familyName: user.familyName || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const updates = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      );
      
      await api.put('/auth/profile', updates);
      
      const token = localStorage.getItem('token');
      if (token) {
        await login(token);
      }
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-lg">
        <div className="flex items-center space-x-4">
            <Avatar name={user?.name || user?.email} src={user?.profilePicture} size={80} />
            <div className="flex-grow">
                <label htmlFor="profilePicture" className="block text-sm font-medium">Profile Picture URL</label>
                <input type="text" name="profilePicture" id="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium">Display Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
         <div>
          <label htmlFor="givenName" className="block text-sm font-medium">First Name</label>
          <input type="text" name="givenName" id="givenName" value={formData.givenName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
         <div>
          <label htmlFor="familyName" className="block text-sm font-medium">Last Name</label>
          <input type="text" name="familyName" id="familyName" value={formData.familyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
        
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}