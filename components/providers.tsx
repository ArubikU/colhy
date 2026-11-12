
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  userType?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via API (which checks cookie)
    // For simple JWT in cookie without exposing to JS, we might just assume valid if not 401 on data fetch
    // But better to have a /api/auth/me endpoint.
    // For this migration, let's try to hit a protected route or a specific /me endpoint.
    // I'll assume we implement /api/users/me later or similar.
    // For now, let's skip active verification on mount and rely on middleware redirecting if unauthorized.
    // Functionally, the frontend needs to know IF we are logged in to show UI.
    // I'll add a quick /api/auth/me endpoint plan OR just rely on success of data fetching.

    // Let's implement a quick check.
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');

        // Check for HTML response (redirect to login)
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          setUser(null);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Session check failed', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to send login link');
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
