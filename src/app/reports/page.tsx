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
    strengths?: string[];
  };
}

export default function ReportsPage() {
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
          setSessions(data.sessions);
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
              <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '0.35rem' }}>Reports & Analytics</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>View insights and performance trends across all your interviews.</p>
            </div>
            <Link href="/interview" className="btn btn-primary btn-header-action">
              Start Practice
            </Link>
          </div>
          
          {sessionsLoading ? (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <div className="loader" />
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="stats-row stats-row-4" style={{ marginBottom: '2rem' }}>
                <div className="card stat-card">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Total Interviews</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{sessions.length}</div>
                </div>
                <div className="card stat-card">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Completed</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{sessions.filter(s => s.status === 'completed').length}</div>
                </div>
                <div className="card stat-card">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Average Score</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {sessions.filter(s => s.feedback?.overallScore !== undefined).length > 0 
                      ? `${Math.round(sessions.filter(s => s.feedback?.overallScore !== undefined).reduce((acc, s) => acc + (s.feedback?.overallScore || 0), 0) / sessions.filter(s => s.feedback?.overallScore !== undefined).length)}%`
                      : '-'}
                  </div>
                </div>
                <div className="card stat-card">
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>Best Score</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                    {sessions.filter(s => s.feedback?.overallScore !== undefined).length > 0
                      ? `${Math.max(...sessions.filter(s => s.feedback?.overallScore !== undefined).map(s => s.feedback?.overallScore || 0))}%`
                      : '-'}
                  </div>
                </div>
              </div>

              {sessions.length === 0 ? (
                <div className="card text-center" style={{ padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Complete some interviews to see your analytics here.</p>
                  <Link href="/interview" className="btn btn-primary">Start an interview</Link>
                </div>
              ) : (
                <div className="reports-charts-grid">
                  <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.15rem' }}>Skill Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {[
                        { label: 'Communication', key: 'communicationScore', color: 'var(--accent-primary)' },
                        { label: 'Technical Ability', key: 'technicalScore', color: 'var(--accent-green)' },
                        { label: 'Problem Solving', key: 'problemSolvingScore', color: 'var(--accent-amber)' },
                        { label: 'Confidence', key: 'confidenceScore', color: 'var(--accent-red)' }
                      ].map((skill) => {
                        const scoreSum = sessions.reduce((acc, s) => acc + ((s.feedback as any)?.[skill.key] || 0), 0);
                        const completedCount = sessions.filter(s => (s.feedback as any)?.[skill.key] !== undefined).length;
                        const avg = completedCount > 0 ? Math.round(scoreSum / completedCount) : 0;
                        
                        return (
                          <div key={skill.key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
                              <span>{skill.label}</span>
                              <span style={{ fontWeight: 700 }}>{avg}%</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: 'var(--border-input)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${avg}%`, height: '100%', background: skill.color, borderRadius: 4, transition: 'width 1s ease-in-out' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Top Strengths</h3>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                      {sessions.filter(s => s.feedback?.strengths).length > 0 ? (
                        Array.from(new Set(sessions.flatMap(s => s.feedback?.strengths || []))).slice(0, 5).map((strength: string, i: number) => (
                          <li key={i}>{strength}</li>
                        ))
                      ) : (
                        <li>No strengths recorded yet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
