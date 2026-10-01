'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { INTERVIEW_TYPES, InterviewType } from '@/constants/interviewTypes';
import { ThemeToggle } from '@/components/ThemeProvider';
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

export default function DashboardPage() {
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
          // Sort so most recently completed/started sessions are at the top
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

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    );
  }

  const averageScore = sessions.filter(s => s.feedback?.overallScore !== undefined).length > 0 
    ? Math.round(sessions.filter(s => s.feedback?.overallScore !== undefined).reduce((acc, s) => acc + (s.feedback?.overallScore || 0), 0) / sessions.filter(s => s.feedback?.overallScore !== undefined).length)
    : 0;

  const bestScore = sessions.filter(s => s.feedback?.overallScore !== undefined).length > 0
    ? Math.max(...sessions.filter(s => s.feedback?.overallScore !== undefined).map(s => s.feedback?.overallScore || 0))
    : 0;

  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="app-layout">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="top-header-brand">
            <span style={{ color: 'var(--accent-primary)' }}>▲</span>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Mentor AI</span>
          </div>
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
          <div className="page-header-row">
            <div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '0.35rem' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome back, <strong>{user.name}</strong>! Ready for today&apos;s interview practice?</p>
            </div>
            <Link href="/interview" className="btn btn-primary btn-header-action">
              Start New Interview
            </Link>
          </div>

          {/* Stats Row */}
          <div className="stats-row" style={{ marginBottom: '2.5rem' }}>
            <div className="card stat-card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Completed Interviews</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{completedSessions.length}</div>
            </div>
            <div className="card stat-card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Average Score</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{averageScore > 0 ? `${averageScore}%` : '-'}</div>
            </div>
            <div className="card stat-card">
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Best Score</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{bestScore > 0 ? `${bestScore}%` : '-'}</div>
            </div>
          </div>

          {/* Recent Interviews */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem' }}>Recent Interviews</h2>
              <Link href="/history" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>View all</Link>
            </div>

            {sessionsLoading ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <div className="loader" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="card text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '1rem' }}>You haven&apos;t completed any interviews yet.</p>
                <Link href="/interview" className="btn btn-primary btn-sm">Start your first interview</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessions.map((session) => {
                  const typeInfo = INTERVIEW_TYPES[session.interviewType] || INTERVIEW_TYPES.behavioral;
                  const hasScore = session.feedback?.overallScore !== undefined;
                  
                  return (
                    <div
                      key={session.id}
                      className="card session-row"
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
                          <Link href={`/report/${session.id}`} className="session-link">
                            View Report →
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
