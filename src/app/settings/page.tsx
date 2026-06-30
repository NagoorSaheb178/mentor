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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Settings</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Manage your application preferences.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* App Preferences */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                🎨 Application Preferences
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', border: '1px solid var(--border-input)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Appearance</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose your preferred theme for the interface.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '8px' }}>
                  <button 
                    onClick={() => setTheme('light')}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: theme === 'light' ? 'var(--bg-card)' : 'transparent', color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: theme === 'light' ? 600 : 500, boxShadow: theme === 'light' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: theme === 'dark' ? 'var(--bg-card)' : 'transparent', color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: theme === 'dark' ? 600 : 500, boxShadow: theme === 'dark' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                👤 Account Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="settings-form-row" style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}>{user.name}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                </div>
                <div className="settings-form-row" style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Job Role</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}>{user.jobRole}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Experience Level</label>
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-input)', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user.experienceLevel}</div>
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
