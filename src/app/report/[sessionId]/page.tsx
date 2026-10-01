'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { INTERVIEW_TYPES, InterviewType } from '@/constants/interviewTypes';
import { ThemeToggle } from '@/components/ThemeProvider';

interface FeedbackData {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionBreakdown: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
}

interface SessionData {
  id: string;
  interviewType: InterviewType;
  status: string;
  feedback?: FeedbackData;
  transcript?: any[];
  score?: number;
  startedAt: string;
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { user, loading: authLoading, getToken } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchSession = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch(`/api/interview/feedback?sessionId=${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
        }
      } catch (e) {
        console.error('Failed to fetch session:', e);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSession();
  }, [user, sessionId, getToken]);

  if (authLoading || loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container text-center" style={{ padding: '4rem 1rem' }}>
        <h2>Session not found</h2>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const typeInfo = INTERVIEW_TYPES[session.interviewType] || INTERVIEW_TYPES.behavioral;
  const score = session.feedback?.overallScore || session.score || 0;
  const scoreColor = score >= 80 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/dashboard" className="btn-back">
            <span className="back-arrow">←</span>
            <span className="report-back-label">Dashboard</span>
          </Link>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/</span>
          <Link href="/reports" className="btn-back">
            Reports
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
          >
            <span>↓</span> <span className="btn-pdf-label">PDF</span>
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
          
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '0.35rem' }}>
              {user.jobRole} Interview
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {new Date(session.startedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {typeInfo.label}
            </p>
          </div>

          {/* Interactive Tabs */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-card)', marginBottom: '2rem' }}>
            <div 
              onClick={() => setActiveTab('overview')}
              style={{ paddingBottom: '0.75rem', borderBottom: activeTab === 'overview' ? '2px solid var(--accent-primary)' : 'none', color: activeTab === 'overview' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'overview' ? 600 : 500, cursor: 'pointer' }}
            >
              Overview
            </div>
            <div 
              onClick={() => setActiveTab('transcript')}
              style={{ paddingBottom: '0.75rem', borderBottom: activeTab === 'transcript' ? '2px solid var(--accent-primary)' : 'none', color: activeTab === 'transcript' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'transcript' ? 600 : 500, cursor: 'pointer' }}
            >
              Transcript
            </div>
          </div>

          {activeTab === 'transcript' && session.transcript ? (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Interview Transcript</h3>
              {session.transcript.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No transcript available for this session.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {session.transcript.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                      <strong style={{ color: msg.role === 'assistant' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {msg.role === 'assistant' ? 'AI Interviewer' : 'You'}
                      </strong>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{msg.transcript || msg.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'overview' && session.status !== 'completed' ? (
            <div className="card text-center" style={{ padding: '4rem 1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Interview Incomplete</h3>
              <p>This interview session was not completed, so no feedback report was generated.</p>
              <Link href={`/interview/${session.id}`} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Resume Interview
              </Link>
            </div>
          ) : !session.feedback ? (
            <div className="card text-center" style={{ padding: '4rem 1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Feedback Not Available</h3>
              <p>There was an issue generating feedback for this session. The transcript was likely too short.</p>
            </div>
          ) : (
            <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              
              {/* Left Column: Overall Score */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Overall Score</h3>
                
                {/* Circular Chart */}
                <div style={{ position: 'relative', width: 140, height: 140, marginBottom: '2rem' }}>
                  <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="var(--border-card)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="transparent" 
                      stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {score}%
                  </div>
                </div>

                <div style={{ fontWeight: 600, color: scoreColor }}>
                  {score >= 80 ? 'Great Performance!' : score >= 60 ? 'Good effort!' : 'Needs improvement'}
                </div>
              </div>

              {/* Right Column: Summary & Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div className="card">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Performance Breakdown</h3>
                  <div className="breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Communication:</span> <strong style={{ color: 'var(--text-primary)' }}>{session.feedback.communicationScore}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Technical:</span> <strong style={{ color: 'var(--text-primary)' }}>{session.feedback.technicalScore}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Problem Solving:</span> <strong style={{ color: 'var(--text-primary)' }}>{session.feedback.problemSolvingScore}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Confidence:</span> <strong style={{ color: 'var(--text-primary)' }}>{session.feedback.confidenceScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Feedback Details</h3>
                  <div className="feedback-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-green)' }}>✓</span> Strengths
                      </div>
                      <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {session.feedback.strengths.map((item, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-red)' }}>✕</span> Areas to Improve
                      </div>
                      <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {session.feedback.weaknesses.map((item, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent-red)', flexShrink: 0 }}>✕</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {session.feedback.recommendations && session.feedback.recommendations.length > 0 && (
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-card)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Recommendations</div>
                      <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {session.feedback.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
