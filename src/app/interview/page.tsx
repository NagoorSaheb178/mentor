'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { INTERVIEW_TYPES, InterviewType } from '@/constants/interviewTypes';
import { ThemeToggle } from '@/components/ThemeProvider';

export default function InterviewSetupPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<InterviewType>('behavioral');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleStartSession = async () => {
    const token = getToken();
    if (!token) return;

    setCreating(true);
    try {
      const res = await fetch('/api/interview/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ interviewType: selectedType })
      });

      if (!res.ok) throw new Error('Failed to create session');
      
      const data = await res.json();
      router.push(`/interview/${data.sessionId}`);
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="top-header" style={{ padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>←</span> Back
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ThemeToggle />
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--accent-primary)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '3rem 1rem', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          
          {/* Mock Wizard Steps */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-secondary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>✓</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role & Experience</span>
              </div>
              <div style={{ width: 60, height: 2, background: 'var(--border-card)', marginBottom: 20 }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>2</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Interview Type</span>
              </div>
              <div style={{ width: 60, height: 2, background: 'var(--border-card)', marginBottom: 20 }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-card)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem', background: 'var(--bg-card)' }}>3</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>Review</span>
              </div>
            </div>
          </div>

          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Let&apos;s set up your interview</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Tell us about the interview you want to practice for.</p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Job Role</label>
                <div className="form-input" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
                  {user.jobRole}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Experience Level</label>
                <div className="form-input" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
                  {user.experienceLevel}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Interview Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {Object.entries(INTERVIEW_TYPES).map(([key, typeInfo]) => {
                const isSelected = selectedType === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedType(key as InterviewType)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-card)',
                      background: isSelected ? 'var(--accent-secondary)' : 'var(--bg-card)',
                      borderRadius: 12,
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {typeInfo.icon}
                    </div>
                    <div style={{ fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {typeInfo.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {typeInfo.description}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleStartSession} 
              className="btn btn-primary" 
              disabled={creating}
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: 10 }}
            >
              {creating ? 'Preparing Room...' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
