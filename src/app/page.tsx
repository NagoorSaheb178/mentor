'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeProvider';

// ── SVG Icons ─────────────────────────────────────────────────────
function IconMic({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function IconDeployedCode({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-9 5-9-5V8l9-5 9 5v8z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconLayers({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconRecordVoiceOver({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M18 8a3 3 0 0 1 0 6" />
      <path d="M20 5a6 6 0 0 1 0 12" />
    </svg>
  );
}

function IconPlay({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function IconEditDocument({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconClosedCaption({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M10 10a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2" />
      <path d="M16 10a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2" />
    </svg>
  );
}

function IconAward({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function IconCheckCircle({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconSmartToy({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function IconPerson({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── Target Companies & Loops (Mentor AI Marquee) ──────────────────
const interviewLoops = [
  { name: 'Google Loop', Icon: IconDeployedCode },
  { name: 'Meta System Design', Icon: IconLayers },
  { name: 'Amazon STAR Method', Icon: IconRecordVoiceOver },
  { name: 'Microsoft Technical', Icon: IconMic },
  { name: 'Netflix Culture Fit', Icon: IconAward },
  { name: 'Stripe Reliability', Icon: IconCheckCircle },
  { name: 'Uber Scale Loop', Icon: IconDeployedCode },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => { });
    }
  }, []);

  const spectralBars = [
    { height: 25 },
    { height: 40 },
    { height: 65 },
    { height: 55 },
    { height: 85 },
    { height: 95 },
    { height: 70 },
    { height: 45 },
    { height: 60 },
    { height: 30 },
    { height: 50 },
    { height: 20 },
    { height: 35 },
    { height: 15 },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', overflowX: 'hidden' }}>

      {/* ── TOP NAVIGATION ── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease'
      }}>
        <div className="auralis-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--accent-primary)' }}>▲</span>
              <span>Mentor AI</span>
            </Link>
            <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="#tracks" style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Tracks</a>
              <a href="#evaluation" style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>AI Evaluation</a>
              <a href="#platform" style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Platform</a>
              <Link href="/login" style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Log in</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <ThemeToggle />
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.45rem 1.15rem', borderRadius: 9999, fontSize: '0.88rem', fontWeight: 600 }}>
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (KEPT EXACTLY AS REQUESTED) ── */}
      <section className="hero-section" style={{ paddingTop: '130px' }}>
        <div className="container">
          <div className="hero-grid">
            {/* Left: Copy */}
            <div className="hero-copy">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.35rem 0.95rem', borderRadius: 9999,
                background: 'var(--accent-secondary)',
                border: '1px solid var(--border-card)',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
                letterSpacing: '0.01em', width: 'fit-content'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
                <span>AI-Powered Interview Practice</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Practice interviews.<br />
                <span style={{ color: 'var(--accent-primary)' }}>Get the job.</span>
              </h1>

              <p style={{
                fontSize: '1.08rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 480,
                letterSpacing: '-0.01em'
              }}>
                Have a real voice conversation with Alex, your AI interviewer. Get instant, detailed feedback on exactly what to improve before the real thing.
              </p>

              <div className="hero-cta-row" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Link
                  href="/signup"
                  className="btn btn-primary btn-lg"
                  style={{
                    borderRadius: 9999,
                    padding: '0.85rem 1.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <span>Start practicing free</span>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
                </Link>
                <Link
                  href="/login"
                  className="btn btn-secondary btn-lg"
                  style={{
                    borderRadius: 9999,
                    padding: '0.85rem 1.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                >
                  Sign in
                </Link>
              </div>

              {/* Social Proof with Real Avatar Headshots */}
              <div className="hero-social-proof" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&q=80'
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Candidate Avatar"
                      width={32}
                      height={32}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--bg-primary)',
                        marginLeft: i > 0 ? -9 : 0,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem', lineHeight: 1 }}>
                    {'★★★★★'}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    10,000+ job seekers practicing
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Alex photo */}
            <div className="hero-photo-wrapper">
              <div className="hero-photo-card" style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.15)', border: '1px solid var(--border-card)' }}>
                <Image
                  src="/Alex.png"
                  alt="Alex — AI Interviewer"
                  width={380}
                  height={480}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'top center' }}
                  priority
                />
                <div style={{ padding: '0.95rem 1.25rem', borderTop: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Alex</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Senior AI Interviewer</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(74,124,89,0.12)', border: '1px solid rgba(74,124,89,0.25)', padding: '0.35rem 0.75rem', borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
                    Available now
                  </div>
                </div>
              </div>

              {/* Floating bubble — hidden on mobile via CSS */}
              <div className="hero-bubble" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 16,
                padding: '0.85rem 1.15rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  <span>Alex</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                  &ldquo;Tell me about a challenging project you&apos;ve led.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HERO PRODUCT PANEL: MENTOR AI DEMO VIDEO & LIVE SIMULATION ── */}
      <section className="auralis-container auralis-gap-xl">
        <div className="auralis-hero-panel">
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10, width: '100%' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-primary)', padding: '0.45rem 1.15rem',
              borderRadius: 9999, border: '1px solid var(--border-card)',
              fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span>Voice AI Interviewer Active</span>
            </div>
          </div>

          {/* Center Showcase: Always-Visible Demo Video with Ambient Glow */}
          <div style={{
            position: 'relative', width: '100%', maxWidth: 940, margin: '2rem auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10
          }}>
            {/* Ambient Colorful Gradient Orbs behind the video */}
            <div className="auralis-orbs-container" style={{ zIndex: 0, opacity: 0.75 }}>
              <div className="auralis-orb-rose" />
              <div className="auralis-orb-indigo" />
              <div className="auralis-orb-emerald" />
              <div className="auralis-orb-sky" />
            </div>

            {/* Video Player Box */}
            <div
              suppressHydrationWarning
              style={{
                position: 'relative', width: '100%', aspectRatio: '16/9',
                borderRadius: 24, overflow: 'hidden', zIndex: 2,
                boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-card)', backgroundColor: '#000'
              }}
            >
              <video
                ref={videoRef}
                src="/demo.mp4"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls
                suppressHydrationWarning
              />
            </div>

            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Full Platform Walkthrough • Voice AI &amp; Instant Report
              </span>
            </div>
          </div>

          {/* Bottom Bar: Mentor AI Feature Pills */}
          <div className="auralis-bottom-bar">
            <div className="auralis-categories-scroll">
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Dynamic Voice Loop</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Context-Aware Follow-Ups</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>LangGraph Evaluation</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>STAR Framework Analysis</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Instant Scorecard</span>
            </div>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.45rem 1.35rem', borderRadius: 9999, fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Start practicing free
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP: TARGET LOOPS ── */}
      <section className="auralis-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 className="font-label-caps-auralis text-secondary-auralis">
          Trusted by 10,000+ candidates cracking top tech &amp; leadership roles
        </h3>
      </section>

      {/* ── LOGO MARQUEE: TECH INTERVIEW LOOPS ── */}
      <section className="auralis-marquee-wrapper auralis-gap-lg">
        <div className="auralis-marquee-track">
          {[...interviewLoops, ...interviewLoops].map((item, idx) => (
            <div key={idx} className="auralis-logo-item">
              <item.Icon size={24} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW: VOICE LOOP + GRAPH EVALUATION ── */}
      <section id="platform" className="auralis-container auralis-gap-xl">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 4rem auto' }}>
          <h2 className="font-h2-auralis" style={{ marginBottom: '1.25rem' }}>
            Two systems, one unfair career advantage
          </h2>
          <p className="font-body-lg-auralis">
            A real-time unscripted voice conversation paired with a multi-node AI evaluation pipeline that analyzes your delivery, problem-solving, and confidence like an executive hiring committee.
          </p>
        </div>

        {/* 2-Col Grid */}
        <div className="auralis-grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Card 1 */}
          <div className="auralis-feature-card">
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(193, 127, 62, 0.08), rgba(245, 166, 35, 0.15))', pointerEvents: 'none' }} />
            <div style={{ zIndex: 10, color: 'var(--accent-primary)' }}>
              <IconMic size={28} />
            </div>
            <div style={{ zIndex: 10 }}>
              <h4 className="font-h3-auralis" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Unscripted Conversational Loop</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No robotic multiple-choice or static question banks. Alex listens actively, challenges your technical assumptions, and digs into edge cases.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="auralis-feature-card">
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(74, 124, 89, 0.08), rgba(20, 184, 166, 0.15))', pointerEvents: 'none' }} />
            <div style={{ zIndex: 10, color: 'var(--accent-green)' }}>
              <IconClosedCaption size={28} />
            </div>
            <div style={{ zIndex: 10 }}>
              <h4 className="font-h3-auralis" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Live Transcript &amp; Telemetry</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Full verbatim transcription captured with milliseconds latency. Filler words, stuttering, and articulation pacing are logged for feedback.
              </p>
            </div>
          </div>
        </div>

        {/* 16:9 Showcase: Glassmorphic Voice Engine Widget */}
        <div className="auralis-glass-showcase">
          {/* Glowing Ambient Accents */}
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(193, 127, 62, 0.25)', filter: 'blur(90px)', transform: 'translate(-120px, -40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(74, 124, 89, 0.25)', filter: 'blur(90px)', transform: 'translate(120px, 40px)', pointerEvents: 'none' }} />

          {/* Glassmorphic Widget Container */}
          <div className="auralis-glass-widget">
            {/* Header: Status & Identifier */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                  Voice Evaluation Engine v2.4 PRO
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Active Interview Dialogue
                </span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.8rem', borderRadius: 9999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Session Live
                </span>
              </div>
            </div>

            {/* Spectral Visualization */}
            <div className="auralis-spectral-bars">
              {spectralBars.map((bar, i) => (
                <div
                  key={i}
                  className="auralis-spec-bar"
                  style={{
                    height: `${bar.height}%`,
                    background: i > 3 && i < 7
                      ? 'linear-gradient(to top, rgba(193, 127, 62, 0.4), var(--accent-primary))'
                      : 'linear-gradient(to top, rgba(74, 124, 89, 0.4), var(--accent-green))',
                    animationDelay: `${(i * 0.09).toFixed(2)}s`
                  }}
                />
              ))}
            </div>

            {/* Metrics Grid tailored to interviews */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '0.5rem 0', borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Audio Latency</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>24</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ms</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>96.8</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>%</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>STAR Depth</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>94</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>%</span>
                </div>
              </div>
            </div>

            {/* Playback Controls & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Voice Stream</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '0.2rem 0.6rem', borderRadius: 8, border: '1px solid var(--border-card)' }}>
                  01:42.12
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Session Duration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERVIEW TRACKS MODULE ── */}
      <section id="tracks" className="auralis-container auralis-gap-xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span className="font-label-caps-auralis" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)', padding: '0.35rem 0.9rem', borderRadius: 9999 }}>
            Interview Tracks
          </span>
          <div style={{ height: 1, background: 'var(--border-card)', flexGrow: 1 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem', alignItems: 'flex-end' }}>
          <div>
            <h2 className="font-h2-auralis" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Practice every format before the real loop
            </h2>
          </div>
          <div>
            <p className="font-body-lg-auralis">
              Calibrated to your target job role and experience level. Master behavioral storytelling, distributed systems architecture, and live problem-solving.
            </p>
          </div>
        </div>

        {/* 2 Large Track Cards */}
        <div className="auralis-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="auralis-feature-card">
            <div style={{ zIndex: 10, color: 'var(--accent-primary)' }}>
              <IconMic size={28} />
            </div>
            <div style={{ zIndex: 10 }}>
              <h4 className="font-h3-auralis" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Behavioral &amp; Leadership (STAR)</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Master Situation, Task, Action, and Result communication. Alex spots vague claims, presses for metric-driven outcomes, and sharpens your delivery.
              </p>
            </div>
          </div>

          <div className="auralis-feature-card">
            <div style={{ zIndex: 10, color: 'var(--accent-green)' }}>
              <IconLayers size={28} />
            </div>
            <div style={{ zIndex: 10 }}>
              <h4 className="font-h3-auralis" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>System Design &amp; Architecture</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Design high-scale architectures under conversational pressure. Defend your database choices, message brokers, caching strategies, and failovers.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Track Cards (Replacing Generic Media) */}
        <div className="auralis-grid-4">
          <div className="auralis-small-card">
            <IconMic size={24} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Behavioral Track</span>
          </div>

          <div className="auralis-small-card">
            <IconDeployedCode size={24} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Technical Deep-Dive</span>
          </div>

          <div className="auralis-small-card">
            <IconLayers size={24} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>System Design</span>
          </div>

          <div className="auralis-small-card">
            <IconRecordVoiceOver size={24} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Culture &amp; Leadership</span>
          </div>
        </div>
      </section>

      {/* ── AI EVALUATION & FEEDBACK MODULE ── */}
      <section id="evaluation" className="auralis-container auralis-gap-xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span className="font-label-caps-auralis" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)', padding: '0.35rem 0.9rem', borderRadius: 9999 }}>
            Multi-Node AI Evaluation
          </span>
          <div style={{ height: 1, background: 'var(--border-card)', flexGrow: 1 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem', alignItems: 'flex-end' }}>
          <div>
            <h2 className="font-h2-auralis" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Interviewers that listen, challenge, and score
            </h2>
          </div>
          <div>
            <p className="font-body-lg-auralis">
              Monolithic prompts give vague compliments. Mentor AI runs your session transcript through dedicated LangGraph evaluation nodes for communication, technical rigor, and actionable recommendations.
            </p>
          </div>
        </div>

        <div className="auralis-grid-2">
          {/* Card 1: Real-time Dialogue Mockup */}
          <div className="auralis-agent-card">
            {/* Ambient Background Glow */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, pointerEvents: 'none' }}>
              <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(193, 127, 62, 0.25), transparent 70%)', filter: 'blur(40px)', transform: 'translate(-80px, -60px)' }} />
              <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74, 124, 89, 0.25), transparent 70%)', filter: 'blur(40px)', transform: 'translate(80px, 60px)' }} />
            </div>

            <div style={{ zIndex: 10, alignSelf: 'flex-start', background: 'var(--bg-primary)', padding: '0.4rem 1rem', borderRadius: 9999, border: '1px solid var(--border-card)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'auto' }}>
              Adaptive Voice Dialogue
            </div>

            {/* Chat Bubble Dialogue Mockup */}
            <div style={{ zIndex: 10, marginTop: 'auto', background: 'var(--bg-primary)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '1.25rem', borderRadius: 20, border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconSmartToy size={18} />
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '0.6rem 1rem', borderRadius: 16, borderTopLeftRadius: 4, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  &ldquo;Can you share concrete metrics on how much that caching layer reduced your p99 latency?&rdquo;
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexDirection: 'row-reverse' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconPerson size={18} />
                </div>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.6rem 1rem', borderRadius: 16, borderTopRightRadius: 4, fontSize: '0.85rem' }}>
                  &ldquo;It reduced p99 latency from 450ms down to 32ms and cut database read load by 68%.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Scorecard & Question-by-Question Audit */}
          <div className="auralis-agent-card">
            {/* Visual Performance Bars */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '7.5rem', opacity: 0.85, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 160, width: '80%' }}>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '6px 6px 0 0', height: '60%' }} />
                <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '6px 6px 0 0', height: '75%' }} />
                <div style={{ flex: 1, background: 'var(--accent-secondary)', border: '1px solid var(--accent-primary)', borderRadius: '6px 6px 0 0', height: '92%', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -12, right: '50%', transform: 'translateX(50%)', width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-card)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                  </div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '6px 6px 0 0', height: '82%' }} />
                <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '6px 6px 0 0', height: '68%' }} />
              </div>
            </div>

            <div style={{ zIndex: 10, alignSelf: 'flex-start', background: 'var(--bg-primary)', padding: '0.4rem 1rem', borderRadius: 9999, border: '1px solid var(--border-card)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'auto' }}>
              Performance Analytics
            </div>

            <div style={{ zIndex: 10, marginTop: 'auto', background: 'var(--bg-primary)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '1.25rem', borderRadius: 20, border: '1px solid var(--border-card)' }}>
              <h4 className="font-h3-auralis" style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>Question-by-Question Audit</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Instant score breakdown across communication, problem solving, technical depth, and specific feedback on how to rephrase answers for higher scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGN OFF SECTION ── */}
      <section className="auralis-container auralis-gap-xl" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="font-h2-auralis" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', maxWidth: 760, marginBottom: '1.25rem' }}>
          Walk into your next interview with complete confidence
        </h2>
        <p className="font-body-lg-auralis" style={{ maxWidth: 580, marginBottom: '2.5rem' }}>
          No stage fright. No awkward practice partners. Just realistic voice interviews with Alex whenever you are ready.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ borderRadius: 9999, padding: '0.85rem 2.25rem' }}>
            Start practicing free
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: 9999, padding: '0.85rem 2.25rem' }}>
            Sign in to dashboard
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ width: '100%', borderTop: '1px solid var(--border-card)', backgroundColor: 'var(--bg-secondary)', padding: '3rem 0' }}>
        <div className="auralis-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
              Mentor AI
            </span>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              © 2026 Mentor AI. Built to help candidates succeed.
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="#tracks" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Tracks</Link>
            <Link href="#evaluation" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Evaluation</Link>
            <Link href="/login" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Log in</Link>
            <Link href="/signup" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
