'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="loader" style={{ margin: 'auto', display: 'block', marginTop: '20vh' }} />;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="top-header">
          <Link href="/dashboard" className="btn-back">
            <span className="back-arrow">←</span> Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeToggle />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user.name}</span>
            </div>
          </div>
        </header>

        <div style={{ padding: '2.5rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Your Profile</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Manage your personal information and goals.</p>
          
          <div className="card text-center" style={{ padding: '4rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h2>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            <p style={{ marginTop: '1rem', fontWeight: 500 }}>{user.experienceLevel} {user.jobRole}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
