"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, Trash } from 'lucide-react';

interface Session {
    id: string;
    createdAt: string;
    createdByIp: string;
}

export default function SessionManager() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/sessions');
            setSessions(response.data.sessions);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (sessionId: string) => {
        if (confirm('Are you sure you want to revoke this session?')) {
            try {
                await api.delete(`/auth/sessions/${sessionId}`);
                await fetchSessions();
            } catch (error) {
                alert('Failed to revoke session.');
            }
        }
    };
    
    const handleRevokeAll = async () => {
        if (confirm('Are you sure you want to revoke ALL other sessions? You will be logged out everywhere else.')) {
             try {
                await api.post(`/auth/sessions/revoke-all`);
                await fetchSessions();
            } catch (error) {
                alert('Failed to revoke all sessions.');
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
                 <button onClick={handleRevokeAll} className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
                     <Trash className="w-4 h-4" />
                     Revoke All
                 </button>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">This is a list of devices that have logged into your account. Revoke any sessions you do not recognize.</p>
            
            {loading ? (
                <p className="mt-4">Loading sessions...</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {sessions.map(session => (
                        <li key={session.id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                            <div>
                                <p className="font-semibold dark:text-white">IP Address: {session.createdByIp}</p>
                                <p className="text-sm text-gray-500">
                                    Logged in on: {new Date(session.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => handleRevoke(session.id)} className="p-2 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50" title="Revoke Session">
                                <Trash2 className="w-5 h-5"/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}