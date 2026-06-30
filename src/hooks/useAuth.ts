'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }, []);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; max-age=0; path=/';
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }

    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    document.cookie = `auth_token=${data.token}; max-age=${7 * 24 * 3600}; path=/`;
    setUser(data.user);
    return data;
  };

  const signup = async (formData: {
    email: string;
    password: string;
    name: string;
    jobRole: string;
    experienceLevel: string;
  }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }

    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    document.cookie = `auth_token=${data.token}; max-age=${7 * 24 * 3600}; path=/`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; max-age=0; path=/';
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, signup, logout, getToken };
}
