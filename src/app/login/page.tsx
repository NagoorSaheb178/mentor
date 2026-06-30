'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type ErrorField = 'email' | 'password' | 'general' | null;

function friendlyError(raw: string): { message: string; field: ErrorField } {
  const msg = raw.toLowerCase();
  if (msg.includes('invalid credentials')) {
    return { message: 'Incorrect email or password. Please try again.', field: 'general' };
  }
  if (msg.includes('invalid input') || msg.includes('email')) {
    return { message: 'Please enter a valid email address.', field: 'email' };
  }
  if (msg.includes('password')) {
    return { message: 'Incorrect password. Please try again.', field: 'password' };
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return { message: 'Connection error. Check your internet and try again.', field: 'general' };
  }
  return { message: 'Something went wrong. Please try again.', field: 'general' };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState<ErrorField>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const { message, field } = friendlyError(err.message || '');
      setError(message);
      setErrorField(field);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const inputError = (field: 'email' | 'password') =>
    errorField === field || errorField === 'general'
      ? {
          borderColor: 'var(--accent-red)',
          boxShadow: '0 0 0 3px rgba(192, 57, 43, 0.1)',
        }
      : {};

  return (
    <div className="auth-page">
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem' }}>
        <Link href="/" className="btn-back">
          <span className="back-arrow">←</span> Home
        </Link>
      </div>

      <div
        className="auth-card"
        style={shake ? { animation: 'shake 0.45s ease' } : {}}
      >
        <Link href="/" className="auth-logo">
          <span className="auth-logo-icon">▲</span>
          Mentor AI
        </Link>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your interview practice.</p>

        {error && (
          <div className="alert-error" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ flexShrink: 0, marginTop: '0.05rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); setErrorField(null); }}
              style={inputError('email')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); setErrorField(null); }}
              style={inputError('password')}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
