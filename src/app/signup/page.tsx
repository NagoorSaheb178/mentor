'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-level');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({ name, email, password, jobRole, experienceLevel });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem' }}>
        <Link href="/" className="btn-back">
          <span className="back-arrow">←</span> Home
        </Link>
      </div>
      <div className="auth-card auth-card-wide">

        <Link href="/" className="auth-logo">
          <span className="auth-logo-icon">▲</span>
          Mentor AI
        </Link>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start practicing interviews in under two minutes.</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-divider" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="jobRole">Target role</label>
              <input
                id="jobRole"
                type="text"
                className="form-input"
                placeholder="e.g. Frontend Developer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expLevel">Experience level</label>
              <select
                id="expLevel"
                className="form-input"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead / Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
