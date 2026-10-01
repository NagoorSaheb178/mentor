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
          <div className="page-header-row" style={{ marginBottom: '1.75rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '0.35rem' }}>Interview History</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>View all your past interview sessions and their detailed reports.</p>
            </div>
            <Link href="/interview" className="btn btn-primary btn-header-action">
              Practice Again
            </Link>
          </div>
          
          <div className="card" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
            {sessionsLoading ? (
              <div className="text-center" style={{ padding: '3rem 0' }}>
                <div className="loader" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center" style={{ padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>You haven&apos;t completed any interviews yet.</p>
                <Link href="/interview" className="btn btn-primary">Start your first interview</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessions.map((session) => {
                  const typeInfo = INTERVIEW_TYPES[session.interviewType] || INTERVIEW_TYPES.behavioral;
                  const hasScore = session.feedback?.overallScore !== undefined;
                  
                  return (
                    <div
                      key={session.id}
                      className="session-row"
                      onClick={() => router.push(`/report/${session.id}`)}
                    >
                      <div className="session-main">
                        <div className="session-icon">
                          {typeInfo.icon}
                        </div>
                        <div className="session-info">
                          <div className="session-title">{typeInfo.label} Interview</div>
                          <div className="session-date">
                            {session.status === 'completed' && session.endedAt 
                              ? `Completed ${new Date(session.endedAt).toLocaleDateString()} at ${new Date(session.endedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                              : `Started ${new Date(session.startedAt).toLocaleDateString()} • Incomplete`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="session-meta-group">
                        <div className="session-status">
                          {hasScore ? (
                            <div className="session-score" style={{ 
                              color: session.feedback!.overallScore >= 80 ? 'var(--accent-green)' : session.feedback!.overallScore >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)',
                            }}>
                              {session.feedback!.overallScore}%
                            </div>
                          ) : session.status === 'completed' ? (
                            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>Completed</span>
                          ) : (
                            <span className="badge">Incomplete</span>
                          )}
                        </div>

                        <div className="session-action">
                          <Link href={`/report/${session.id}`} className="btn btn-secondary btn-sm" onClick={(e) => e.stopPropagation()}>
                            View Details
                          </Link>
                        </div>
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
