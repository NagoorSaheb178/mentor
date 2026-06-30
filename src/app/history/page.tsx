'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeProvider';
import { INTERVIEW_TYPES, InterviewType } from '@/constants/interviewTypes';
import { Sidebar } from '@/components/Sidebar';

interface Session {
  id: string;
  startedAt: string;
  endedAt?: string;
  interviewType: InterviewType;
  status: string;
  feedback?: {
    overallScore: number;
  };
}

export default function HistoryPage() {
  const { user, loading, logout, getToken } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch('/api/interview/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sessions.sort((a: any, b: any) => {
            const timeA = new Date(a.endedAt || a.startedAt).getTime();
            const timeB = new Date(b.endedAt || b.startedAt).getTime();
            return timeB - timeA;
          });
          setSessions(sorted);
        }
      } catch (e) {
        console.error('Failed to fetch sessions:', e);
      } finally {
        setSessionsLoading(false);
      }
    };

    if (user) fetchSessions();
  }, [user, getToken]);

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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Interview History</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>View all your past interview sessions and their detailed reports.</p>
          
          <div className="card" style={{ padding: '2rem' }}>
            {sessionsLoading ? (
              <div className="text-center" style={{ padding: '3rem 0' }}>
                <div className="loader" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>You haven't completed any interviews yet.</p>
                <Link href="/interview" className="btn btn-primary">Start your first interview</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.map((session) => {
                  const typeInfo = INTERVIEW_TYPES[session.interviewType] || INTERVIEW_TYPES.behavioral;
                  const hasScore = session.feedback?.overallScore !== undefined;
                  
                  return (
                    <div
                      key={session.id}
                      className="session-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        border: '1px solid var(--border-card)',
                        borderRadius: '12px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => router.push(`/report/${session.id}`)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', width: '50%' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-secondary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', fontSize: '1.1rem' }}>{typeInfo.label} Interview</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {session.status === 'completed' && session.endedAt 
                              ? `Completed on ${new Date(session.endedAt).toLocaleDateString()} at ${new Date(session.endedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                              : `Started on ${new Date(session.startedAt).toLocaleDateString()} • Incomplete`}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ width: '20%', textAlign: 'center' }}>
                        {session.status === 'completed' ? (
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>Completed</span>
                        ) : (
                          <span className="badge">Incomplete</span>
                        )}
                      </div>

                      <div style={{ width: '20%', textAlign: 'center' }}>
                        {hasScore ? (
                          <div style={{ 
                            color: session.feedback!.overallScore >= 80 ? 'var(--accent-green)' : session.feedback!.overallScore >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)',
                            fontWeight: 700,
                            fontSize: '1.2rem'
                          }}>
                            {session.feedback!.overallScore}%
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>--</span>
                        )}
                      </div>

                      <div style={{ width: '20%', textAlign: 'right' }}>
                        <Link href={`/report/${session.id}`} className="btn btn-secondary btn-sm" onClick={(e) => e.stopPropagation()}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
