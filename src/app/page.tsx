'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeProvider';

// ── SVG Icons ─────────────────────────────────────────────────────
function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}
function IconBarChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function IconTrendingUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────
const features = [
  { Icon: IconMic,        title: 'Voice-Based Interviews',    desc: 'Speak naturally with Alex, your AI interviewer. Real conversation, not scripted chatbots.' },
  { Icon: IconBarChart,   title: 'Detailed Feedback Reports', desc: 'Every session generates a score breakdown across communication, confidence, and technical ability.' },
  { Icon: IconLayers,     title: 'Adaptive Question Sets',    desc: 'Behavioral, technical, leadership — practice the interview type that matters most to you.' },
  { Icon: IconTrendingUp, title: 'Progress Tracking',         desc: 'Watch your scores improve over time. Analytics show exactly where you are getting better.' },
  { Icon: IconZap,        title: 'Instant Results',           desc: 'No waiting. AI analysis runs right after your session ends and results are ready immediately.' },
  { Icon: IconShield,     title: 'Private & Secure',          desc: 'Your transcripts and data stay private. Practice without any pressure or judgment.' },
];

const steps = [
  { n: '1', title: 'Create your account',        desc: 'Sign up in 30 seconds. Tell us your target role and experience level so we can tailor the session.' },
  { n: '2', title: 'Choose your interview type',  desc: 'Pick from behavioral, technical, leadership, or mixed. We match Alex to the format.' },
  { n: '3', title: 'Talk to Alex',                desc: 'Have a real voice conversation. No typing — just speak like you would in a real interview.' },
  { n: '4', title: 'Review your report',          desc: 'Get a full breakdown of strengths, weaknesses, and specific recommendations for next time.' },
];

const testimonials = [
  { quote: 'I did five sessions before my Google loop and felt completely calm on the actual day. The feedback was incredibly specific.', name: 'Priya S.', role: 'Software Engineer', bg: '#e8d5c4', initial: 'P' },
  { quote: 'The behavioral interview practice is really good. It pointed out that I was giving vague answers and helped me fix it.', name: 'Marcus L.', role: 'Product Manager', bg: '#c8d8e8', initial: 'M' },
  { quote: 'Clean, simple, and actually useful. I liked that the feedback felt honest and not just generic tips.', name: 'Aisha K.', role: 'Data Analyst', bg: '#d4e4d4', initial: 'A' },
];

const skillBars = [
  { label: 'Communication',   pct: 82, color: 'var(--accent-primary)' },
  { label: 'Technical',       pct: 74, color: 'var(--accent-green)' },
  { label: 'Problem Solving', pct: 90, color: '#7c6d8a' },
  { label: 'Confidence',      pct: 67, color: 'var(--accent-amber)' },
];

// ── Page ─────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* ── Navbar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-card)',
        backdropFilter: 'blur(10px)',
      }}>
        <div className="container">
          <header className="navbar">
            <div className="navbar-logo">
              <span className="navbar-logo-icon">▲</span>
              <span>Mentor AI</span>
            </div>
            <nav className="home-nav">
              {/* Nav links — hidden on mobile via .home-nav-links */}
              <div className="home-nav-links">
                {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#testimonials', 'Reviews']].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="nav-anchor"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="navbar-cta-group">
                <ThemeToggle />
                <Link href="/login" className="btn btn-secondary btn-sm">Log in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            </nav>
          </header>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container">
          {/* hero-grid: 2-col on desktop, 1-col on mobile */}
          <div className="hero-grid">
            {/* Left: Copy */}
            <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.3rem 0.85rem', borderRadius: '999px',
                background: 'var(--accent-secondary)',
                border: '1px solid var(--border-card)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-primary)',
                width: 'fit-content',
              }}>
                AI-Powered Interview Practice
              </div>

              <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, color: 'var(--text-primary)' }}>
                Practice interviews.<br />
                <span style={{ color: 'var(--accent-primary)' }}>Get the job.</span>
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 460 }}>
                Have a real voice conversation with Alex, your AI interviewer. Get instant, detailed feedback on exactly what to improve before the real thing.
              </p>

              <div className="hero-cta-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/signup" className="btn btn-primary btn-lg">Start practicing free</Link>
                <Link href="/login" className="btn btn-secondary btn-lg">Sign in</Link>
              </div>

              <div className="hero-social-proof" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex' }}>
                  {['#e8c9a0', '#a8c8d8', '#a8c8a8', '#d8c0c0'].map((bg, i) => (
                    <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: bg, border: '2px solid var(--bg-primary)', marginLeft: i > 0 ? -7 : 0 }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10,000+ job seekers practicing</span>
              </div>
            </div>

            {/* Right: Alex photo */}
            <div className="hero-photo-wrapper" style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div className="hero-photo-card">
                <Image
                  src="/Alex.png"
                  alt="Alex — AI Interviewer"
                  width={380}
                  height={480}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', objectPosition: 'top center' }}
                  priority
                />
                <div style={{ padding: '0.85rem 1.15rem', borderTop: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Alex</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Senior AI Interviewer</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(74,124,89,0.1)', padding: '0.3rem 0.7rem', borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
                    Available now
                  </div>
                </div>
              </div>

              {/* Floating bubble — hidden on mobile */}
              <div
                className="hero-bubble"
                style={{ position: 'absolute', bottom: 70, left: -40, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '0.75rem 1rem', boxShadow: 'var(--shadow-md)', maxWidth: 220 }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.3rem' }}>Alex</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Tell me about a challenging project you&apos;ve led.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="section-label">What you get</div>
            <h2 className="section-title" style={{ margin: '0 auto 0.75rem' }}>Everything you need to prepare</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Built for people who take interviews seriously and want real practice, not just tips.
            </p>
          </div>

          <div className="features-grid">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon"><Icon /></div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="how-section">
        <div className="container">
          <div className="how-grid">
            <div>
              <div className="section-label">Process</div>
              <h2 className="section-title">Simple from day one</h2>
              <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                No complicated setup. You can be in a mock interview in under two minutes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {steps.map((s) => (
                  <div key={s.n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="step-number">{s.n}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{s.title}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.15rem', fontWeight: 500 }}>Overall Score</div>
                  <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>78 / 100</div>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-primary)' }}>
                  78%
                </div>
              </div>
              {skillBars.map((s) => (
                <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '0.85rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.82rem', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Reviews</div>
            <h2 className="section-title">What people are saying</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Real feedback from people who used Mentor AI before their interviews.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', opacity: 0.85 }} />
                  ))}
                </div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.bg, color: '#444', fontSize: '0.85rem' }}>{t.initial}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box" style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16, padding: '4rem 2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Ready to start?</div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Your next interview starts here
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Free to start. No credit card. Just practice.
            </p>
            <Link href="/signup" className="btn btn-primary btn-lg">Create a free account</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-card)', padding: '2rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div className="navbar-logo" style={{ fontSize: '0.9rem' }}>
              <span className="navbar-logo-icon">▲</span> Mentor AI
            </div>
            <span>© 2025 Mentor AI. Built to help you succeed.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
