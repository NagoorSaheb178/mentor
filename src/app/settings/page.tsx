'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
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
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="header-username" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user.name}</span>
            </Link>
          </div>
        </header>

        <div className="page-body-container">
          <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '0.35rem' }}>Settings</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your application preferences.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* App Preferences */}
            <div className="card" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                🎨 Application Preferences
              </h3>
              <div className="settings-theme-row">
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Appearance</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Choose your preferred theme for the interface.</div>
                </div>
                <div className="theme-toggle-group">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`btn-theme-choice ${theme === 'light' ? 'active' : ''}`}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`btn-theme-choice ${theme === 'dark' ? 'active' : ''}`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card" style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                👤 Account Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="settings-form-row">
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Full Name</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.name}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email Address</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-muted)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Job Role</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.jobRole}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Experience Level</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)', textTransform: 'capitalize', fontSize: '0.9rem' }}>{user.experienceLevel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
