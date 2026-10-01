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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <ThemeToggle />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="header-username" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user.name}</span>
            </div>
          </div>
        </header>

        <div className="page-body-container">
          <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '0.35rem' }}>Your Profile</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your personal information and goals.</p>
          
          <div className="card text-center" style={{ padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)', fontSize: '1.8rem', margin: '0 auto 1.25rem' }}>
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ marginTop: '1.25rem', display: 'inline-block', padding: '0.4rem 1rem', background: 'var(--bg-secondary)', borderRadius: 999, fontWeight: 500, fontSize: '0.875rem' }}>
              {user.experienceLevel} {user.jobRole}
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-card)' }}>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ color: 'var(--accent-red)', borderColor: 'var(--border-card)', padding: '0.65rem 2rem' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
