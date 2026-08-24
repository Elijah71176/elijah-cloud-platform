'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3001/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      if (data.user?.role !== 'ADMIN') {
        setError('Admin access only');
        return;
      }

      localStorage.setItem(
        'elijah-cloud-platform-token',
        data.accessToken,
      );

      localStorage.setItem(
        'elijah-cloud-platform-user',
        JSON.stringify(data.user),
      );

      // Keep this temporarily because the current
      // admin layout still checks the old flag.
      localStorage.setItem(
        'elijah-cloud-platform-admin',
        'true',
      );

      router.push('/admin/dashboard');
    } catch {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: 40,
      }}
    >
      <section
        style={{
          maxWidth: 420,
          margin: '80px auto',
          background: 'white',
          padding: 28,
          borderRadius: 18,
          border: '1px solid #e2e8f0',
        }}
      >
        <h1>Admin Login</h1>

        <p style={{ color: '#64748b' }}>
          Sign in with your administrator account.
        </p>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginTop: 16,
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
            }}
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginTop: 12,
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p
              style={{
                color: 'crimson',
                fontWeight: 700,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 18,
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: 0,
              background: '#2563eb',
              color: 'white',
              fontWeight: 900,
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}