'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@/hooks/useAuth';
import { useVapi } from '@/hooks/useVapi';
import { INTERVIEW_TYPES, InterviewType } from '@/constants/interviewTypes';
import { ThemeToggle } from '@/components/ThemeProvider';
import { createFeedbackGraph } from '@/ai/langgraph/frontendGraph';

interface SessionInfo {
  interviewType: InterviewType;
  status: string;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Clean SVG icons — no emojis
function IconMic({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function IconFileText({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function VoiceInterviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { user, loading: authLoading, getToken } = useAuth();
  const router = useRouter();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const { isCallActive, transcript, startCall, endCall, error } = useVapi();

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
          setSessionInfo({
            interviewType: data.session.interviewType as InterviewType,
            status: data.session.status,
          });
          if (data.session.status === 'completed') {
            router.push(`/report/${sessionId}`);
          }
        }
      } catch (e) {
        console.error('Session fetch error:', e);
      } finally {
        setSessionLoading(false);
      }
    };

    if (user) fetchSession();
  }, [user, sessionId, getToken, router]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStart = async () => {
    setStarted(true);
    await startCall(
      user?.jobRole || 'Software Engineer',
      sessionInfo?.interviewType || 'behavioral',
      user?.name || 'Candidate',
      user?.experienceLevel || 'Mid-level'
    );
  };

  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const forceEnded = useRef(false);
  const hasConnected = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (showTranscript && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, showTranscript]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = typeof reason === 'string' ? reason : reason?.message || '';
      if (msg.includes('ejection') || msg.includes('Meeting ended')) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  useEffect(() => {
    if (isCallActive) {
      hasConnected.current = true;
    }
  }, [isCallActive]);

  const handleEndConfirm = async () => {
    setShowEndConfirm(false);
    forceEnded.current = true;
    endCall();
    router.push('/dashboard');
  };

  useEffect(() => {
    if (started && hasConnected.current && !isCallActive && !forceEnded.current) {
      const generateFeedbackAndRedirect = async () => {
        if (transcript.length === 0) {
          router.push(`/dashboard`);
          return;
        }

        setIsGeneratingFeedback(true);
        const token = getToken();
        let feedbackData = null;

        try {
          const transcriptText = transcript.map(t => `${t.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${t.transcript || t.text}`).join('\n');

          // 🚀 Trigger LangGraph Pipeline 🚀
          const graph = createFeedbackGraph();
          
          const initialState = {
            transcriptText,
            interviewType: sessionInfo?.interviewType || 'behavioral',
            jobRole: user?.jobRole || 'Software Engineer',
          };

          const finalState = await graph.invoke(initialState);
          feedbackData = finalState.finalFeedbackJson;

        } catch (e) {
          console.error('Failed to generate feedback via LangGraph/Puter', e);
        }

        try {
          await fetch('/api/interview/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              sessionId,
              transcript: transcript,
              ...(feedbackData ? { feedback: feedbackData } : {})
            })
          });
        } catch (e) {
          console.error('Failed to save session data to database', e);
        }

        setIsGeneratingFeedback(false);
        router.push(`/report/${sessionId}`);
      };

      generateFeedbackAndRedirect();
    }
  }, [isCallActive, started, transcript, sessionInfo, user, sessionId, getToken, router]);

  if (authLoading || sessionLoading || isGeneratingFeedback) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div className="loader" />
        {isGeneratingFeedback && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Generating your feedback report...</p>
        )}
      </div>
    );
  }

  return (
    <div className="interview-room">
      <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

      {/* Header */}
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!started && (
            <Link href="/dashboard" className="btn-back">
              <span className="back-arrow">←</span>
              <span className="btn-back-label">Dashboard</span>
            </Link>
          )}
          <div className="brand-logo">
            <IconMic size={16} />
            <span>Interview in Progress</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="interview-body">
        <main className="interview-main" style={{ position: 'relative' }}>

          {/* End confirm overlay */}
          {showEndConfirm && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card" style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>End interview?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Are you sure you want to finish? We&apos;ll generate your feedback report immediately.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => setShowEndConfirm(false)}>Cancel</button>
                  <button className="btn" onClick={handleEndConfirm} style={{ background: 'var(--accent-red)', color: 'white' }}>
                    End interview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pre-start screen */}
          {!started ? (
            <div className="interview-prestart">
              {/* Alex portrait */}
              <div className="interview-prestart-photo">
                <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-card)' }}>
                  <img
                    src="/Alex.png"
                    alt="Alex — AI Interviewer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Alex</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.15rem' }}>Senior AI Interviewer</div>
                </div>
              </div>

              {/* Info & Start */}
              <div className="interview-prestart-info">
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.75rem', lineHeight: 1.25, fontWeight: 700 }}>
                  Ready for your interview?
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  Hi <strong>{user?.name}</strong>, I&apos;ll be conducting your{' '}
                  <strong>{INTERVIEW_TYPES[sessionInfo?.interviewType || 'behavioral']?.label}</strong> interview today.
                  Just talk naturally — I&apos;ll guide you through the whole session.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                  {[
                    'Voice-based live interview',
                    'Real-time AI feedback after session',
                    'Professional scoring on 4 key skills',
                  ].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-green)', flexShrink: 0, display: 'flex' }}>
                        <IconCheck size={15} />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconMic size={16} />
                  Start Interview
                </button>
              </div>
            </div>
          ) : (
            /* Active call screen */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', gap: '1.5rem', padding: '1rem' }}>

              {/* Alex avatar ring */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  className={`avatar-ring ${isCallActive ? 'speaking' : ''}`}
                  style={{ width: 200, height: 200, padding: 0, overflow: 'hidden' }}
                >
                  <img
                    src="/Alex.png"
                    alt="Alex — AI Interviewer"
                    className={isCallActive ? 'alex-talking' : 'alex-idle'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                  />
                </div>
                {/* Status dot */}
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  width: 16, height: 16, borderRadius: '50%',
                  background: isCallActive ? 'var(--accent-green)' : 'var(--accent-amber)',
                  border: '3px solid var(--bg-primary)',
                  transition: 'background 0.4s ease',
                }} />
              </div>

              {/* Name & status */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', fontWeight: 700 }}>Alex</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Senior AI Interviewer</div>
                <div style={{
                  marginTop: '0.6rem',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 0.85rem', borderRadius: 999,
                  background: isCallActive ? 'rgba(74,124,89,0.1)' : 'rgba(193,127,62,0.1)',
                  color: isCallActive ? 'var(--accent-green)' : 'var(--accent-amber)',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.4s ease',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  {isCallActive ? 'Speaking / Listening' : 'Connecting...'}
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(192,57,43,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(192,57,43,0.2)', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              {/* Controls */}
              <div className="interview-controls">
                <button
                  className="btn btn-secondary interview-ctrl-btn"
                  onClick={() => setShowTranscript(t => !t)}
                >
                  <IconFileText size={15} />
                  <span>Transcript</span>
                </button>

                <div className="mic-btn mic-btn-recording" style={{
                  background: isCallActive ? 'var(--accent-green)' : 'var(--accent-amber)',
                }}>
                  <IconMic size={24} />
                </div>

                <button
                  className="btn interview-ctrl-btn"
                  style={{ color: 'var(--accent-red)', borderColor: 'var(--border-card)', background: 'var(--bg-card)' }}
                  onClick={() => setShowEndConfirm(true)}
                >
                  <IconX size={15} />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Transcript panel */}
        <aside
          id="transcript-panel"
          className="transcript-panel"
          style={{ display: showTranscript ? 'flex' : 'none' }}
        >
          <div className="transcript-header">
            <span>Live Transcript</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className="status-dot" style={{ background: 'var(--accent-green)' }} />
              Live
            </span>
          </div>
          <div className="transcript-list">
            {transcript.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', paddingTop: '1rem' }}>
                Conversation will appear here...
              </div>
            ) : (
              transcript.map((entry, i) => (
                <div key={i} className="transcript-entry" style={{ display: 'flex', flexDirection: 'column', alignItems: entry.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className="transcript-role" style={{ color: entry.role === 'assistant' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {entry.role === 'assistant' ? 'Alex' : 'You'}
                  </div>
                  <div style={{
                    background: entry.role === 'assistant' ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid var(--border-card)',
                    maxWidth: '85%',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.55,
                  }}>
                    {entry.transcript || entry.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </aside>
      </div>
    </div>
  );
}
